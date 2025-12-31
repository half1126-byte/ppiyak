import React, { useState } from 'react';
import { Send } from 'lucide-react';

/**
 * 챗봇 입력 컴포넌트
 */
export default function ChatInput({ inputType, options, onSubmit, disabled, placeholder }) {
    const [value, setValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim() || disabled) return;

        onSubmit(value.trim());
        setValue('');
    };

    const handleSelectOption = (option) => {
        if (disabled) return;
        onSubmit(option);
    };

    // Select 버튼들
    if (inputType === 'select' && options.length > 0) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-gray-500 mb-3">옵션을 선택해주세요:</p>
                <div className="grid grid-cols-2 gap-2">
                    {options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelectOption(option)}
                            disabled={disabled}
                            className="px-4 py-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium rounded-xl transition-all hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Textarea (긴 텍스트)
    if (inputType === 'textarea') {
        return (
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                    type="submit"
                    disabled={!value.trim() || disabled}
                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-soft hover:shadow-medium transition-all flex items-center justify-center gap-2"
                >
                    <Send className="w-4 h-4" />
                    전송하기
                </button>
            </form>
        );
    }

    // Text input (기본)
    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="flex-1 px-4 py-3 border-2 border-yellow-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
                type="submit"
                disabled={!value.trim() || disabled}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-soft hover:shadow-medium transition-all flex items-center gap-2"
            >
                <Send className="w-4 h-4" />
            </button>
        </form>
    );
}
