import React, { useState } from 'react';
import { CHECKLIST_DATA, convertChecklistToFormData } from '../../utils/checklistData';
import ChecklistSection from './ChecklistSection';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Textarea from '../Textarea';
import { Sparkles } from 'lucide-react';

/**
 * 다크 모드 체크리스트 기반 입력 모드
 */
export default function ChecklistMode({ onGenerate, onBack }) {
    const [selections, setSelections] = useState({
        physical: [],
        communication: [],
        social: [],
        art: [],
        nature: [],
        additional: []
    });

    const [basicInfo, setBasicInfo] = useState({
        studentName: '',
        age: '',
        period: '',
        activity: ''
    });

    const [additionalText, setAdditionalText] = useState('');

    const handleToggleItem = (category, itemId) => {
        setSelections(prev => {
            const categorySelections = prev[category] || [];
            const isSelected = categorySelections.includes(itemId);

            return {
                ...prev,
                [category]: isSelected
                    ? categorySelections.filter(id => id !== itemId)
                    : [...categorySelections, itemId]
            };
        });
    };

    const handleGenerate = () => {
        const formData = convertChecklistToFormData(selections, {
            ...basicInfo,
            additionalText
        });

        onGenerate(formData);
    };

    const getTotalSelected = () => {
        return Object.values(selections).reduce((sum, items) => sum + items.length, 0);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-600 rounded-xl">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">유아발달상황</h1>
                                <p className="text-xs text-gray-400">상세 체크리스트로 작성하기</p>
                            </div>
                        </div>
                        <button
                            onClick={onBack}
                            className="text-gray-400 hover:text-white transition-smooth"
                        >
                            ← 돌아가기
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Basic Info */}
                <div className="bg-gray-800 rounded-xl p-6 mb-6 space-y-4">
                    <h3 className="text-lg font-bold mb-4">기본 정보</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="이름"
                            value={basicInfo.studentName}
                            onChange={(e) => setBasicInfo(prev => ({ ...prev, studentName: e.target.value }))}
                            placeholder="예: 김민준"
                            className="bg-gray-900 border-gray-700 text-white"
                        />
                        <Select
                            label="연령"
                            value={basicInfo.age}
                            onChange={(e) => setBasicInfo(prev => ({ ...prev, age: e.target.value }))}
                            className="bg-gray-900 border-gray-700 text-white"
                        >
                            <option value="">선택하세요</option>
                            <option value="만 3세">만 3세</option>
                            <option value="만 4세">만 4세</option>
                            <option value="만 5세">만 5세</option>
                        </Select>
                        <Select
                            label="관찰 기간"
                            value={basicInfo.period}
                            onChange={(e) => setBasicInfo(prev => ({ ...prev, period: e.target.value }))}
                            className="bg-gray-900 border-gray-700 text-white"
                        >
                            <option value="">선택하세요</option>
                            <option value="12월 1주">12월 1주</option>
                            <option value="12월 2주">12월 2주</option>
                            <option value="12월 3주">12월 3주</option>
                            <option value="12월 4주">12월 4주</option>
                        </Select>
                        <Select
                            label="활동"
                            value={basicInfo.activity}
                            onChange={(e) => setBasicInfo(prev => ({ ...prev, activity: e.target.value }))}
                            className="bg-gray-900 border-gray-700 text-white"
                        >
                            <option value="">선택하세요</option>
                            <option value="자유놀이">자유놀이</option>
                            <option value="블록놀이">블록놀이</option>
                            <option value="역할놀이">역할놀이</option>
                            <option value="미술활동">미술활동</option>
                            <option value="바깥놀이">바깥놀이</option>
                        </Select>
                    </div>
                </div>

                {/* Checklist Sections */}
                <div className="space-y-4">
                    {Object.entries(CHECKLIST_DATA).map(([key, category]) => (
                        <ChecklistSection
                            key={key}
                            category={key}
                            data={category}
                            selectedItems={selections[key] || []}
                            onToggleItem={handleToggleItem}
                        />
                    ))}
                </div>

                {/* Additional Input */}
                <div className="bg-gray-800 rounded-xl p-6 mt-6">
                    <h3 className="text-lg font-bold mb-4">추가 사항</h3>
                    <Textarea
                        label="주변 사물들을 긍정적인 관계로 볼 수 있음"
                        value={additionalText}
                        onChange={(e) => setAdditionalText(e.target.value)}
                        placeholder="구체적인 행동과 상황을 기록해주세요..."
                        rows={4}
                        className="bg-gray-900 border-gray-700 text-white"
                        helper="상세하게 작성하면 더 좋은 결과를 얻을 수 있습니다"
                    />
                </div>

                {/* Generate Button */}
                <div className="mt-8 sticky bottom-4">
                    <button
                        onClick={handleGenerate}
                        disabled={getTotalSelected() === 0 || !basicInfo.studentName}
                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                        <Sparkles className="w-5 h-5" />
                        유아발달상황 생성 ({getTotalSelected()}개 선택됨)
                    </button>
                </div>
            </div>
        </div>
    );
}
