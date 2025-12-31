import React from 'react';
import { MESSAGE_TYPES } from '../../utils/chatbotFlow';
import { Bot, User } from 'lucide-react';

/**
 * 챗봇 메시지 버블 컴포넌트
 */
export default function ChatMessage({ message }) {
    const isBot = message.type === MESSAGE_TYPES.BOT;
    const isUser = message.type === MESSAGE_TYPES.USER;

    if (isBot) {
        return (
            <div className="flex items-start gap-3 animate-fade-in">
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-soft">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                </div>
                <div className="flex-1 max-w-[80%]">
                    <div className="bg-yellow-50 rounded-2xl rounded-tl-sm p-4 shadow-sm">
                        <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                            {message.content}
                        </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 ml-3">
                        {new Date(message.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
        );
    }

    if (isUser) {
        return (
            <div className="flex items-start gap-3 justify-end animate-slide-in">
                <div className="flex-1 max-w-[80%] flex flex-col items-end">
                    <div className="bg-white border-2 border-yellow-200 rounded-2xl rounded-tr-sm p-4 shadow-sm">
                        <p className="text-gray-900 leading-relaxed">
                            {message.content}
                        </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 mr-3">
                        {new Date(message.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
