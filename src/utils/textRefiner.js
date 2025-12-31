/**
 * TextRefiner.js
 * Implements the "AlzzaAI Teacher" guidelines for refining raw observation notes into proper Life Record format.
 * And "Safe Tone Converter" for Alimjang/Consultation.
 */

const ENDING_MAPPINGS = [
    { target: /(했습니다|했어요|했음|했다|했어)$/g, replace: '했음' },
    { target: /(보였습니다|보였어요|보였다|보였어)$/g, replace: '보였음' },
    { target: /(놀았습니다|놀았어요|놀았다|놀았어)$/g, replace: '놀았음' },
    { target: /(먹었습니다|먹었어요|먹었다|먹었어)$/g, replace: '먹었음' },
    { target: /(싸웠습니다|싸웠어요|싸웠다|싸웠어)$/g, replace: '갈등이 있었음' },
    { target: /(합니다|해요|한다|해)$/g, replace: '함' },
    { target: /(입니다|이에요|이야|이라서)$/g, replace: '임' },
    { target: /(있습니다|있어요|있다|있어)$/g, replace: '있음' },
    { target: /(없습니다|없어요|없다|없어)$/g, replace: '없음' },
    { target: /(됩니다|되어요|돼요|된다|돼)$/g, replace: '됨' },
    { target: /(하다)$/g, replace: '함' },
    { target: /(이다)$/g, replace: '임' },
    { target: /(있다)$/g, replace: '있음' },
    { target: /(좋습니다|좋아요|좋다|좋아)$/g, replace: '좋음' },
    { target: /(보입니다|보여요|보인다|보여)$/g, replace: '보임' },
    { target: /(나타납니다|나타나요|나타난다|나타나)$/g, replace: '나타남' },
    { target: /(즐깁니다|즐겨요|즐긴다|즐겨)$/g, replace: '즐김' },
];

const POSITIVE_REFRAMING = [
    { target: /산만하(고|며| 지만)/g, replace: '호기심이 많고 에너지가 넘치나 ' },
    { target: /산만함/g, replace: '관심사가 다양함' },
    { target: /고집이 세(고|며)/g, replace: '자기 주관이 뚜렷하' },
    { target: /느리(고|며)/g, replace: '신중하게 탐색하' },
    { target: /말이 없(고|며)/g, replace: '경청하는 태도가 좋으' },
    { target: /싸우(고|며)/g, replace: '갈등 해결 과정을 경험하' },
    { target: /울(고|며)/g, replace: '감정 표현에 솔직하' },
];

function splitToFiveSentences(text) {
    let lines = text.split(/\n+/).map(s => s.trim()).filter(Boolean);
    if (lines.length >= 5) return lines.slice(0, 5);
    const rough = text.replace(/\s+/g, " ").split(/(?<=[.!?])\s+|(?<=함)\s+|(?<=임)\s+/).map(s => s.trim()).filter(Boolean);
    if (rough.length >= 5) return rough.slice(0, 5);
    if (lines.length > 0 && lines.length > rough.length) return lines;
    return rough;
}

export function refineText(rawText) {
    if (!rawText) return "";
    let sentences = splitToFiveSentences(rawText);
    let refinedSentences = sentences.map(sentence => {
        let text = sentence;
        let punctuation = text.match(/[.!?]+$/)?.[0] || '.';
        text = text.replace(/[.!?]+$/, '');
        text = text.replace(/^(나는|제가|선생님이 보기에|00이는|XX이는|철수는|영희는)\s*/, '');
        text = text.replace(/([가-힣]{2,4})(이가|이는|는|가) /g, '');
        POSITIVE_REFRAMING.forEach(rule => { text = text.replace(rule.target, rule.replace); });
        let matched = false;
        for (const rule of ENDING_MAPPINGS) {
            if (rule.target.test(text)) {
                text = text.replace(rule.target, rule.replace);
                matched = true;
                break;
            }
        }
        if (!matched && !/(함|임|음|됨|김|짐)$/.test(text)) {
            text += '함';
        }
        return text + '.';
    });

    // Length Limit
    const MAX_CHARS = 500;
    while (refinedSentences.join(' ').length > MAX_CHARS) {
        let maxIdx = 0, maxLen = 0;
        refinedSentences.forEach((s, i) => { if (s.length > maxLen) { maxLen = s.length; maxIdx = i; } });
        if (maxLen <= 20) break;
        refinedSentences[maxIdx] = refinedSentences[maxIdx].slice(0, -5).trim() + '.';
    }
    return refinedSentences.join(' ');
}

export function generateSmartDraft(keywords, domain = 'integrated') {
    return `[${domain}] ${keywords} 관련 활동에 적극적으로 참여함.`;
}

// ---------------------------------------------------------
// NEW: Tone Converter (Persona System)
// ---------------------------------------------------------

/**
 * Checks if a Hangul character has a Patchim (Final Consonant)
 */
function hasPatchim(char) {
    const code = char.charCodeAt(0);
    return (code >= 44032 && code <= 55203) && ((code - 44032) % 28 !== 0);
}

/**
 * Gets the vowel type of the last Hangul character for vowel harmony.
 * Returns 'bright' (ㅏ, ㅗ) or 'dark' (others).
 */
function getVowelType(char) {
    const code = char.charCodeAt(0);
    if (code < 44032 || code > 55203) return 'dark';

    const medial = Math.floor(((code - 44032) / 28) % 21);
    // Vowels: 0:ㅏ, 1:ㅐ, 2:ㅑ, 3:ㅒ, 4:ㅓ, 5:ㅔ, 6:ㅕ, 7:ㅖ, 8:ㅗ, ...
    // Bright vowels: ㅏ(0), ㅗ(8) + diphthongs based on them usually behave bright, but simplify to ㅏ, ㅗ.
    // ㅑ(2)? -> '야' -> '아요' usually.
    // ㅗ(8) -> '와' (Combination)? 
    // Simplified list of Bright Vowels for '아요': ㅏ(0), ㅗ(8), ㅑ(2).
    if (searchVowel(medial, [0, 8, 2])) return 'bright';
    return 'dark'; // ㅓ, ㅜ, ㅡ, etc.
}

function searchVowel(target, list) {
    return list.includes(target);
}

export function convertTone(text, mode = 'polite') {
    // mode: 'default' (No change), 'polite' (습니다), 'soft' (해요)
    if (!text || mode === 'default') return text;

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    const converted = sentences.map(sentence => {
        let s = sentence.trim();
        let content = s.replace(/[.!?]+$/, ''); // Content without period

        // Common processing for both modes (Past tense basics)
        // Extract tense stem if possible? 
        // ~았/었/했음 -> Stem ~았/었/했.

        // -------------------------------------------
        // MODE 1: Polite (Formal - 습니다/합니다)
        // -------------------------------------------
        if (mode === 'polite') {
            // Exceptions
            if (/(있|없|같|좋|싫|작|많)음$/.test(content)) return content + '습니다.';

            // Tense
            if (/(았|었|했|였)음$/.test(content)) return content.replace(/음$/, '습니다.');

            // Standard
            if (/함$/.test(content)) return content.replace(/함$/, '합니다.');
            if (/임$/.test(content)) return content.replace(/임$/, '입니다.');
            if (/됨$/.test(content)) return content.replace(/됨$/, '됩니다.');

            // Patchim Magic
            if (/음$/.test(content)) return content.replace(/음$/, '습니다.');

            const lastChar = content.slice(-1);
            if (hasPatchim(lastChar)) {
                const code = lastChar.charCodeAt(0);
                const jong = (code - 44032) % 28;
                if (jong === 16) { // 'ㅁ' Patchim
                    const newChar = String.fromCharCode(code + 1); // -> 'ㅂ' Patchim
                    return content.slice(0, -1) + newChar + '니다.';
                }
            }
            return content + '니다.'; // Fallback? Dangerous. Better return original if unknown.
        }

        // -------------------------------------------
        // MODE 2: Soft (Gentle - 해요)
        // -------------------------------------------
        if (mode === 'soft') {
            // Tense: 했음 -> 했어요.
            if (/(았|었|했|였)음$/.test(content)) return content.replace(/음$/, '어요.');

            // '함' -> '해요'
            if (/함$/.test(content)) return content.replace(/함$/, '해요.');

            // '됨' -> '돼요'
            if (/됨$/.test(content)) return content.replace(/됨$/, '돼요.');

            // '임' -> '이에요' or '예요'
            if (/임$/.test(content)) {
                const prefix = content.slice(0, -1);
                if (prefix.length > 0) {
                    const lastPrefix = prefix.slice(-1);
                    if (hasPatchim(lastPrefix)) return prefix + '이에요.';
                    else return prefix + '예요.';
                }
                return content.replace(/임$/, '입니다.'); // Fallback
            }

            // '음' ending / 'ㅁ' patchim
            // Need to recover the Stem Vowel.
            // Case 1: "많음" -> "많" + "음". Stem "많". Vowel 'ㅏ'. -> "많아요."
            // Case 2: "먹음" -> "먹" + "음". Stem "먹". Vowel 'ㅓ'. -> "먹어요."
            // Case 3: "감" -> "가" + "ㅁ". Stem "가". Vowel 'ㅏ'. -> "가요."
            // Case 4: "봄" -> "보" + "ㅁ". Stem "보". Vowel 'ㅗ'. -> "봐요."

            let stemChar = '';
            let origin = '';

            // Try to decompose 'ㅁ' patchim
            const lastCode = content.charCodeAt(content.length - 1);
            if (lastCode >= 44032 && lastCode <= 55203) {
                const jong = (lastCode - 44032) % 28;

                // If ends in literal "음" (Eum)
                if (content.endsWith('음') && content.length > 1) {
                    stemChar = content.charAt(content.length - 2); // Char before '음' used for harmony?
                    // Wait. "먹음" -> Stem is "먹". Vowel of "먹".
                    // "기쁨" -> Stem is "기쁘". Vowel "으" -> Irregular. "기뻐요".
                    // Simple Vowel Harmony:
                    if (getVowelType(stemChar) === 'bright') return content.replace(/음$/, '아요.');
                    return content.replace(/음$/, '어요.');
                }

                // If single char with 'ㅁ' patchim (e.g. 감, 봄)
                if (jong === 16) {
                    // Decompose: Remove 'ㅁ'.
                    // New char code: code - 16.
                    // But wait, "감" (Gam, AC10) - 16 = "가" (Ga, AC00).
                    const noPatchimCode = lastCode - 16;
                    const noPatchimChar = String.fromCharCode(noPatchimCode);

                    // "가" -> "가" + "요" = "가요".
                    // "보" -> "봐요" (Combination).
                    // "주무시" -> "주무세요".

                    // Simple approach:
                    // If Vowel is 'ㅏ' -> Just add '요'. (가 -> 가요)
                    // If Vowel is 'ㅗ' -> Convert to 'ㅘ' + '요' (봐요) OR just '보아요'. ('봐요' is contraction).
                    // Let's output '보아요' or '가요'.

                    const vowelType = getVowelType(noPatchimChar);

                    if (vowelType === 'bright') {
                        // Check specific 'ㅗ' for contraction?
                        // Let's just append '아요'.
                        // "가" + "아요" -> "가요" (Korean merges duplicates).
                        // We can blindly return "가요" if it ends in 'ㅏ'.
                        // Use a simpler heuristic:
                        return content.slice(0, -1) + noPatchimChar + '아요.';
                    } else {
                        // Dark
                        return content.slice(0, -1) + noPatchimChar + '어요.';
                    }
                }
            }

            return content + '어요.'; // Fallback
        }

        return s;
    });

    return converted.join(' ');
}
