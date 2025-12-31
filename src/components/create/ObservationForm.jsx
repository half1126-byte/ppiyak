import { useState } from 'react'
import Select from '../Select'
import Textarea from '../Textarea'
import Tooltip from '../Tooltip'
import Badge from '../Badge'
import { CHIP_PRESETS } from '../../utils/constants'

export default function ObservationForm({ formData, onChange }) {
    const [selectedDomain, setSelectedDomain] = useState(null)

    const handleChipClick = (tag) => {
        const currentObservation = formData.observation
        const newObservation = currentObservation
            ? `${currentObservation} ${tag}`
            : tag
        onChange({ ...formData, observation: newObservation })
    }

    return (
        <div className="space-y-6">
            {/* 관찰 기간 */}
            <div>
                <Tooltip content="관찰 기간과 활동을 선택해주세요" position="top">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        📅 관찰 기간
                    </label>
                </Tooltip>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">기간 (예: 12월 1주)</label>
                        <input
                            type="text"
                            value={formData.period}
                            onChange={(e) => onChange({ ...formData, period: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-white"
                            placeholder="직접 입력하세요"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-500">활동 (예: 바깥놀이)</label>
                        <input
                            type="text"
                            value={formData.activity}
                            onChange={(e) => onChange({ ...formData, activity: e.target.value })}
                            className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-slate-800 bg-white"
                            placeholder="직접 입력하세요"
                        />
                    </div>
                </div>
            </div>

            {/* 빠른 입력 칩 */}
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                    💡 빠른 입력
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                    {CHIP_PRESETS.map((preset) => (
                        <button
                            key={preset.domain}
                            onClick={() => setSelectedDomain(
                                selectedDomain === preset.domain ? null : preset.domain
                            )}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth ${selectedDomain === preset.domain
                                ? 'bg-peach-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-peach-100'
                                }`}
                        >
                            {preset.domain}
                        </button>
                    ))}
                </div>
                {selectedDomain && (
                    <div className="flex flex-wrap gap-2 p-4 bg-peach-50 rounded-xl animate-fade-in">
                        {CHIP_PRESETS.find(p => p.domain === selectedDomain)?.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="peach"
                                className="cursor-pointer hover:bg-peach-200 transition-smooth"
                                onClick={() => handleChipClick(tag)}
                            >
                                + {tag}
                            </Badge>
                        ))}
                    </div>
                )}
            </div>

            {/* 관찰 내용 */}
            <div>
                <Tooltip content="구체적인 행동과 상황을 기록해주세요" position="top">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                        📝 관찰 내용
                    </label>
                </Tooltip>
                <Textarea
                    value={formData.observation}
                    onChange={(e) => onChange({ ...formData, observation: e.target.value })}
                    placeholder="구체적인 행동과 상황을 기록해주세요&#10;&#10;예시: 친구와 협력하여 높은 탑을 쌓았습니다. 블록의 균형을 맞추며 문제를 해결했습니다."
                    rows={6}
                    maxLength={500}
                    showCount
                    helperText="💡 구체적으로 작성할수록 더 좋은 결과를 얻을 수 있어요"
                />
            </div>
        </div>
    )
}
