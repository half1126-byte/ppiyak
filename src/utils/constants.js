// Common validation rules and constants
export const RULES = {
    maxChars: 500,
    allowedPunctRegex: /^[0-9A-Za-z가-힣\s.,·]+$/,
    forbiddenSubjects: [
        "학생은", "학생이", "그는", "그가", "그녀는", "그녀가",
        "이 유아는", "해당 유아는"
    ],
    negativeMap: [
        { from: /못함/g, to: "도전해봄" },
        { from: /못하/g, to: "시도해보" },
        { from: /어려워함/g, to: "도전해가고 있음" },
        { from: /어려워하/g, to: "도전해가" },
        { from: /산만함/g, to: "관심을 넓혀가고 있음" },
        { from: /주의가\s*짧음/g, to: "집중을 길러가고 있음" },
        { from: /목소리가\s*작음/g, to: "표현에 자신감을 키워가고 있음" },
        { from: /느림/g, to: "차분히 진행함" },
        { from: /소극적/g, to: "차분히 참여해가고 있음" },
        { from: /공격적/g, to: "감정을 조절해가고 있음" },
        { from: /자주\s*울음/g, to: "감정을 표현하고 조절해가고 있음" }
    ],
    possibleNameRegex: /([가-힣]{2,4})(은|는|이|가|을|를|와|과|에게|한테|에서|으로|로)\b/g,
    endingRegex: /(함|음|임)\.?$/,
}

export const CHIP_PRESETS = [
    { domain: "신체운동·건강", tags: ["소근육 조절", "대근육 이동", "균형", "도구 안전사용", "위생 실천", "휴식/식사 습관"] },
    { domain: "의사소통", tags: ["질문하기", "경험 설명", "짧은 문장", "단어 확장", "듣고 반응", "말 순서 지키기"] },
    { domain: "사회관계", tags: ["양보", "협력", "규칙 이해", "차례 기다림", "감정 조절", "도움 요청/제안"] },
    { domain: "예술경험", tags: ["노래 따라부름", "리듬/움직임", "재료 탐색", "색·선 표현", "작품 설명", "감상 반응"] },
    { domain: "자연탐구", tags: ["관찰", "비교", "분류", "수 세기", "규칙성", "예측/추론"] },
]

export const domainToField = {
    "신체운동·건강": "k_phy",
    "의사소통": "k_com",
    "사회관계": "k_soc",
    "예술경험": "k_art",
    "자연탐구": "k_nat",
}
