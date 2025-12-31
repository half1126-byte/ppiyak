// 챗봇 모드를 위한 대화 흐름 정의

export const CHATBOT_FLOW = [
    {
        id: 'welcome',
        bot: '👋 안녕하세요! 생기부 작성을 도와드리는 AI 비서입니다.\n\n아이의 **이름**을 알려주세요.',
        next: 'name',
        inputType: 'text',
        placeholder: '예: 김민준',
        validation: (value) => value.trim().length > 0
    },
    {
        id: 'name',
        bot: (data) => `네, **${data.studentName}** 어린이에 대한 기록이군요! 😊\n\n연령을 선택해주세요.`,
        next: 'age',
        inputType: 'select',
        options: ['만 3세', '만 4세', '만 5세']
    },
    {
        id: 'age',
        bot: (data) => `**${data.age}** 어린이시군요!\n\n관찰 **기간**을 선택해주세요.`,
        next: 'period',
        inputType: 'select',
        options: ['12월 1주', '12월 2주', '12월 3주', '12월 4주', '1월 1주', '1월 2주', '1월 3주', '1월 4주']
    },
    {
        id: 'period',
        bot: '어떤 **활동**을 관찰하셨나요?',
        next: 'activity',
        inputType: 'select',
        options: ['자유놀이', '블록놀이', '역할놀이', '미술활동', '바깥놀이', '음악활동', '과학활동', '요리활동', '신체활동', '언어활동']
    },
    {
        id: 'activity',
        bot: (data) => `**${data.activity}** 활동 중 관찰하셨군요! 📝\n\n관찰한 내용을 자세히 입력해주세요.\n구체적일수록 더 좋은 문장을 만들어드릴 수 있어요!`,
        next: 'observation',
        inputType: 'textarea',
        placeholder: '예시:\n- 친구와 함께 블록으로 높은 탑을 쌓았습니다\n- 블록의 균형을 맞추며 문제를 해결했습니다\n- 완성 후 친구들에게 자랑스럽게 보여주었습니다',
        minLength: 20
    },
    {
        id: 'observation',
        bot: (data) => {
            const preview = data.observation ? data.observation.substring(0, 100) : '';
            const ellipsis = data.observation && data.observation.length > 100 ? '...' : '';
            return `훌륭해요! ✨\n\n입력하신 내용:\n"${preview}${ellipsis}"\n\n이제 AI가 **3가지 문장**을 생성해드리겠습니다!`;
        },
        next: 'generate',
        inputType: 'action',
        action: 'generate'
    }
];

// 챗봇 메시지 타입
export const MESSAGE_TYPES = {
    BOT: 'bot',
    USER: 'user',
    SYSTEM: 'system'
};

// 봇 메시지 생성 헬퍼
export function createBotMessage(step, formData = {}) {
    const currentStep = CHATBOT_FLOW.find(s => s.id === step);
    if (!currentStep) return '';

    if (typeof currentStep.bot === 'function') {
        return currentStep.bot(formData);
    }
    return currentStep.bot;
}

// 다음 단계 가져오기
export function getNextStep(currentStepId) {
    const currentStep = CHATBOT_FLOW.find(s => s.id === currentStepId);
    return currentStep?.next || null;
}

// 입력 타입 가져오기
export function getInputType(stepId) {
    const step = CHATBOT_FLOW.find(s => s.id === stepId);
    return step?.inputType || 'text';
}

// 선택 옵션 가져오기
export function getOptions(stepId) {
    const step = CHATBOT_FLOW.find(s => s.id === stepId);
    return step?.options || [];
}

// 챗 히스토리를 formData로 변환
export function convertChatToFormData(chatHistory) {
    const formData = {
        studentName: '',
        age: '',
        period: '',
        activity: '',
        observation: ''
    };

    chatHistory.forEach(message => {
        if (message.type === MESSAGE_TYPES.USER) {
            switch (message.stepId) {
                case 'name':
                    formData.studentName = message.content;
                    break;
                case 'age':
                    formData.age = message.content;
                    break;
                case 'period':
                    formData.period = message.content;
                    break;
                case 'activity':
                    formData.activity = message.content;
                    break;
                case 'observation':
                    formData.observation = message.content;
                    break;
            }
        }
    });

    return formData;
}
