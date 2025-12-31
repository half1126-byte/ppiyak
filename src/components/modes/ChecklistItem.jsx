import React from 'react';
import { Check } from 'lucide-react';

/**
 * 개별 체크박스 아이템 컴포넌트
 */
export default function ChecklistItem({ item, isSelected, onToggle, color }) {
    return (
        <label
            className={`
                flex items-center gap-3 p-3 rounded-lg
                cursor-pointer transition-all
                ${isSelected
                    ? 'bg-gray-700 border-2'
                    : 'bg-gray-900 border-2 border-transparent hover:bg-gray-750'
                }
            `}
            style={{
                borderColor: isSelected ? color : 'transparent'
            }}
        >
            {/* Custom Checkbox */}
            <div className="relative flex-shrink-0">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="sr-only"
                />
                <div
                    className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        transition-all
                        ${isSelected
                            ? 'border-transparent scale-110'
                            : 'border-gray-600'
                        }
                    `}
                    style={{
                        backgroundColor: isSelected ? color : 'transparent'
                    }}
                >
                    {isSelected && (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                </div>
            </div>

            {/* Label Text */}
            <span className={`
                text-sm flex-1
                ${isSelected ? 'text-white font-medium' : 'text-gray-300'}
            `}>
                {item.label}
            </span>

            {/* Keywords (subtle) */}
            {item.keywords && item.keywords.length > 0 && (
                <div className="hidden md:flex gap-1">
                    {item.keywords.slice(0, 2).map((keyword, idx) => (
                        <span
                            key={idx}
                            className="text-xs px-2 py-0.5 rounded-full bg-gray-800 text-gray-500"
                        >
                            {keyword}
                        </span>
                    ))}
                </div>
            )}
        </label>
    );
}
