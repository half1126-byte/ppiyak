import { RULES } from './constants'

// Split text into sentences using modern Intl.Segmenter for accurate Korean sentence boundary detection
export function splitSentences(text) {
    if (!text) return []

    // Fallback for browsers without Intl.Segmenter
    if (typeof Intl.Segmenter === 'undefined') {
        return text.split('.').map(s => s.trim()).filter(Boolean)
    }

    const segmenter = new Intl.Segmenter('ko', { granularity: 'sentence' })
    const segments = segmenter.segment(text)
    return Array.from(segments)
        .map(s => s.segment.trim())
        .filter(Boolean)
}

// Check if text contains forbidden punctuation
export function containsForbiddenPunct(text) {
    return !RULES.allowedPunctRegex.test(text)
}

// Detect forbidden subject expressions
export function detectForbiddenSubjects(text) {
    return RULES.forbiddenSubjects.filter(w => text.includes(w))
}

// Detect possible name patterns
export function detectPossibleNames(text) {
    const hits = []
    const matches = text.matchAll(RULES.possibleNameRegex)
    for (const match of matches) {
        hits.push(match[0])
        if (hits.length >= 10) break
    }
    return hits
}

// Detect negative phrases
export function detectNegativePhrases(text) {
    return RULES.negativeMap
        .filter(item => item.from.test(text))
        .map(item => item.from.toString())
}

// Main validation function
export function validateIntegrated(text, context, evidence) {
    const report = []
    const suggest = []
    const raw = (text || "").trim().replace(/\s+/g, " ")
    const totalChars = [...raw].length

    // Input validation
    report.push({ ok: context.length >= 4, msg: `관찰 맥락 입력 ${context.length >= 4 ? "OK" : "부족"}` })
    report.push({ ok: evidence.length >= 10, msg: `관찰 evidence 입력 ${evidence.length >= 10 ? "OK" : "부족(10자 이상 권장)"}` })

    // Character count
    report.push({ ok: totalChars <= RULES.maxChars, msg: `글자수 ${totalChars}/${RULES.maxChars}` })

    // Single paragraph check
    const hasNewline = /[\n\r]/.test(text || "")
    report.push({ ok: !hasNewline, msg: `1문단(줄바꿈 없음) ${!hasNewline ? "OK" : "NG"}` })

    // Punctuation check
    const punctOK = !containsForbiddenPunct(raw)
    report.push({ ok: punctOK, msg: `문장부호 제한(. , · 만) ${punctOK ? "OK" : "NG"}` })

    // Forbidden subjects
    const forbiddenHits = detectForbiddenSubjects(raw)
    report.push({
        ok: forbiddenHits.length === 0,
        msg: `금지 주체(학생은/그는/그녀는 등) ${forbiddenHits.length === 0 ? "OK" : "NG: " + forbiddenHits.join(", ")}`
    })

    // Name detection
    const nameHits = detectPossibleNames(raw)
    report.push({
        ok: nameHits.length === 0,
        msg: `이름 추정 표현 ${nameHits.length === 0 ? "OK" : "주의: " + nameHits.slice(0, 5).join(", ") + (nameHits.length > 5 ? "..." : "")}`
    })

    // Sentence count
    const sents = splitSentences(raw)
    report.push({ ok: sents.length === 5, msg: `문장 수 ${sents.length}/5` })

    // Ending check for each sentence
    if (sents.length > 0) {
        sents.forEach((s, i) => {
            const ok = RULES.endingRegex.test(s + ".")
            report.push({ ok, msg: `${i + 1}문장 종결(~함/~음/~임) ${ok ? "OK" : "NG"}` })
        })
    }

    // Negative expressions
    const neg = detectNegativePhrases(raw)
    report.push({ ok: neg.length === 0, msg: `부정표현 감지 ${neg.length === 0 ? "OK" : "주의(완화 권장)"}` })

    // Generate suggestions
    if (!punctOK) {
        suggest.push("허용 문장부호는 마침표(.), 쉼표(,), 중간점(·)만 남기고 나머지 제거")
    }
    if (forbiddenHits.length) {
        suggest.push("'학생은/그는/그녀는' 같은 주체 표현을 삭제하고 행동 중심으로 시작")
    }
    if (nameHits.length) {
        suggest.push("이름으로 보일 수 있는 'OO는/OO가' 형태를 '또래와/친구와' 같은 표현으로 변경")
    }
    if (sents.length !== 5) {
        suggest.push("마침표로 정확히 5문장이 되도록 재구성")
    }
    if (neg.length) {
        suggest.push("부정 단어를 '시도/도전/키워가고 있음' 같은 성장형 표현으로 치환")
    }

    return { report, suggest, sents, raw }
}

// Auto-fix function
export function autoFixIntegrated(text) {
    let t = (text || "").trim()

    // Remove line breaks
    t = t.replace(/[\n\r]+/g, " ").replace(/\s+/g, " ").trim()

    // Remove forbidden punctuation
    t = t.replace(/[!?;:"'""''()\[\]{}<>《》【】~`@#$%^&*_+=|\\\/…—–\-]/g, "")

    // Remove forbidden subjects
    RULES.forbiddenSubjects.forEach(w => {
        t = t.split(w).join("")
    })

    // Apply negative expression replacements
    RULES.negativeMap.forEach(({ from, to }) => {
        t = t.replace(from, to)
    })

    // Fix sentence count and endings
    let sents = splitSentences(t)

    if (sents.length <= 1) {
        const rough = t.split(",").map(s => s.trim()).filter(Boolean)
        sents = rough.length >= 5 ? rough.slice(0, 5) : rough
    }

    while (sents.length < 5) sents.push("관찰 내용이 추가로 필요함")
    if (sents.length > 5) sents = sents.slice(0, 5)

    // Fix endings
    sents = sents.map(s => {
        let x = (s || "").trim().replace(/\.+$/g, "").trim()
        if (!x) x = "관찰 내용이 추가로 필요함"
        if (!RULES.endingRegex.test(x + ".")) {
            x += "함"
        }
        return x
    })

    // Assemble
    let out = sents.join(". ") + "."

    // Truncate if too long
    while ([...out].length > RULES.maxChars) {
        const arr = out.replace(/\.+$/, "").split(".").map(s => s.trim()).filter(Boolean)
        if (!arr.length) break
        let maxIdx = 0, maxLen = 0
        arr.forEach((s, i) => {
            const L = [...s].length
            if (L > maxLen) { maxLen = L; maxIdx = i }
        })
        if (maxLen <= 25) break
        arr[maxIdx] = arr[maxIdx].slice(0, Math.max(0, arr[maxIdx].length - 8)).trim()
        out = arr.join(". ") + "."
    }

    return out
}
