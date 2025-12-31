import React, { useState, useEffect, useRef } from 'react';
import { CHATBOT_FLOW, MESSAGE_TYPES, createBotMessage, getNextStep, getInputType, getOptions, convertChatToFormData } from '../../utils/chatbotFlow';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { Sparkles } from 'lucide-react';

/**
 * 챗봇 모드 - 대화형 인터페이스
 */
export default function ChatbotMode({ onGenerate, onBack }) {
    const [messages, setMessages] = useState([]);
    const [currentStep, setCurrentStep] = useState('welcome');
    const [formData, setFormData] = useState({
        studentName: '',
        age: '',
        period: '',
        activity: '',
        observation: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);

    // 초기 환영 메시지
    useEffect(() => {
        const welcomeMsg = {
            id: Date.now(),
            type: MESSAGE_TYPES.BOT,
            content: createBotMessage('welcome'),
            timestamp: new Date()
        };
        setMessages([welcomeMsg]);
    }, []);

    // 메시지 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleUserInput = async (input) => {
        if (isProcessing) return;

        setIsProcessing(true);

        // 사용자 메시지 추가
        const userMsg = {
            id: Date.now(),
            type: MESSAGE_TYPES.USER,
            content: input,
            stepId: currentStep,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMsg]);

        // formData 업데이트
        const updatedFormData = { ...formData };
        switch (currentStep) {
            case 'name':
                updatedFormData.studentName = input;
                break;
            case 'age':
                updatedFormData.age = input;
                break;
            case 'period':
                updatedFormData.period = input;
                break;
            case 'activity':
                updatedFormData.activity = input;
                break;
            case 'observation':
                updatedFormData.observation = input;
                break;
        }
        setFormData(updatedFormData);

        // 다음 단계로 진행
        const nextStepId = getNextStep(currentStep);

        setTimeout(() => {
            if (nextStepId === 'generate') {
                // AI 생성 트리거
                onGenerate(updatedFormData);
            } else if (nextStepId) {
                // 봇 응답
                const botMsg = {
                    id: Date.now() + 1,
                    type: MESSAGE_TYPES.BOT,
                    content: createBotMessage(nextStepId, updatedFormData),
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMsg]);
                setCurrentStep(nextStepId);
            }
            setIsProcessing(false);
        }, 600);
    };

    const inputType = getInputType(currentStep);
    const options = getOptions(currentStep);

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50">
            {/* Header */}
            <div className="bg-white border-b border-yellow-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-soft">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">유치원 생기부 봇</h1>
                                <p className="text-xs text-gray-600">선생님의 시간을 아껴드립니다</p>
                            </div>
                        </div>
                        <button
                            onClick={onBack}
                            className="text-gray-600 hover:text-gray-900 transition-smooth"
                        >
                            ← 돌아가기
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Container */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-2xl shadow-large p-6 min-h-[600px] flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-6">
                        {messages.map(message => (
                            <ChatMessage key={message.id} message={message} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <ChatInput
                        inputType={inputType}
                        options={options}
                        onSubmit={handleUserInput}
                        disabled={isProcessing || currentStep === 'generate'}
                        placeholder={currentStep === 'observation'
                            ? '구체적인 행동과 상황을 기록해주세요...'
                            : '입력해주세요...'
                        }
                    />
                </div>

                {/* Tips */}
                <div className="mt-6 p-4 bg-yellow-100 rounded-xl">
                    <p className="text-sm text-yellow-800">
                        💡 <strong>팁:</strong> 관찰 내용을 구체적으로 작성하면 더 훌륭한 생기부 문장을 생성할 수 있어요!
                    </p>
                </div>
            </div>
        </div>
    );
}
