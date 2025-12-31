import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ChecklistItem from './ChecklistItem';

/**
 * 체크리스트 영역별 섹션 컴포넌트
 */
export default function ChecklistSection({ category, data, selectedItems, onToggleItem }) {
    const [isExpanded, setIsExpanded] = useState(true);

    const selectedCount = selectedItems.length;
    const totalCount = data.items.length;

    return (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
            {/* Section Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-2xl">{data.emoji}</span>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-white">{data.title}</h3>
                        <p className="text-sm text-gray-400">
                            {selectedCount > 0 ? `${selectedCount}/${totalCount}개 선택됨` : `총 ${totalCount}개 항목`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <div
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{
                                backgroundColor: `${data.color}20`,
                                color: data.color
                            }}
                        >
                            {selectedCount}
                        </div>
                    )}
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>
            </button>

            {/* Section Items */}
            {isExpanded && (
                <div className="px-6 pb-4 space-y-2">
                    {data.items.map(item => (
                        <ChecklistItem
                            key={item.id}
                            item={item}
                            isSelected={selectedItems.includes(item.id)}
                            onToggle={() => onToggleItem(category, item.id)}
                            color={data.color}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
