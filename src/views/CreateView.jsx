import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, BookOpen, User, Smile, GraduationCap } from 'lucide-react';
import TiltCard from '../components/ui/TiltCard';
import MotionButton from '../components/ui/MotionButton';
import StudentInfoForm from '../components/create/StudentInfoForm';
import ObservationForm from '../components/create/ObservationForm';
import AISuggestionCard from '../components/create/AISuggestionCard';
import ValidationReport from '../components/create/ValidationReport';
import ModeSelector from '../components/ModeSelector';
import ChecklistMode from '../components/modes/ChecklistMode';
import FreeInputMode from '../components/modes/FreeInputMode';
import TemplateModal from '../components/templates/TemplateModal';
import { convertTone } from '../utils/textRefiner';

export default function CreateView({
    currentInputMode,
    setCurrentInputMode,
    setCurrentView,
    formData,
    setFormData,
    aiSuggestions,
    setAiSuggestions,
    selectedText,
    setSelectedText,
    validationReport,
    handleGenerateAI,
    handleSelectSuggestion,
    handleCopy,
    handleDownload,
    handleSave,
    onSaveAsTemplate
}) {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [persona, setPersona] = useState('default'); // 'default' | 'polite' | 'soft'

    // Calculate display text based on persona
    const displayText = convertTone(selectedText, persona);

    const handleCopyCurrent = () => {
        handleCopy(displayText);
    };

    const personas = [
        { id: 'default', label: '기본', icon: GraduationCap, color: 'bg-slate-100 text-slate-600', activeOp: 'bg-slate-800 text-white shadow-lg', desc: '생기부 기록용 (~함/음)' },
        { id: 'polite', label: '알림장', icon: User, color: 'bg-blue-50 text-blue-600', activeOp: 'bg-blue-600 text-white shadow-lg', desc: '공지사항용 (~합니다)' },
        { id: 'soft', label: '상담/소통', icon: Smile, color: 'bg-pink-50 text-pink-600', activeOp: 'bg-pink-500 text-white shadow-lg', desc: '부드러운 대화용 (~해요)' },
    ];

    return (
        <motion.div
            key="create"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Mode Specific Render */}
            {currentInputMode === 'checklist' && <ChecklistMode onGenerate={(d) => { setFormData(d); handleGenerateAI(); setCurrentInputMode('form') }} onBack={() => setCurrentInputMode('form')} />}
            {currentInputMode === 'free' && <FreeInputMode onGenerate={(d) => { setFormData({ ...formData, observation: d.observation }); setCurrentInputMode('form'); setSelectedText(d.observation); }} onBack={() => setCurrentInputMode('form')} />}

            {currentInputMode === 'form' && (
                <div className="max-w-4xl mx-auto space-y-6">
                    <MotionButton onClick={() => setCurrentView('dashboard')} variant="ghost" className="pl-0">← 대시보드로 돌아가기</MotionButton>
                    {!aiSuggestions.length && !selectedText && <ModeSelector currentMode={currentInputMode} onModeChange={setCurrentInputMode} />}

                    {!aiSuggestions.length && (
                        <TiltCard className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">새 기록 작성</h2>
                            <div className="space-y-6">
                                <StudentInfoForm formData={formData} onChange={setFormData} />
                                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                                    <button
                                        onClick={() => {
                                            const content = document.getElementById('observation-content');
                                            content.classList.toggle('hidden');
                                        }}
                                        className="w-full bg-slate-50 p-4 flex justify-between items-center hover:bg-slate-100 transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-slate-700">📝 유아발달상황 (관찰 및 활동)</span>
                                        </div>
                                        <span className="text-slate-400">▼</span>
                                    </button>
                                    <div id="observation-content" className="p-6 bg-white transition-all">
                                        <ObservationForm formData={formData} onChange={setFormData} />
                                    </div>
                                </div>
                                <MotionButton variant="primary" size="lg" icon={Sparkles} onClick={handleGenerateAI} disabled={!formData.observation} className="w-full">AI 문장 생성하기</MotionButton>
                            </div>
                        </TiltCard>
                    )}

                    {aiSuggestions.length > 0 && !selectedText && (
                        <div className="space-y-4">
                            <TiltCard className="p-6 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white">
                                <h2 className="text-2xl font-bold mb-2">✨ AI가 제안했어요</h2>
                                <p className="text-secondary-100">마음에 드는 문장을 선택하세요</p>
                            </TiltCard>
                            {aiSuggestions.map((s, i) => (
                                <TiltCard key={s.id} className="p-0"><AISuggestionCard suggestion={s} index={i} onSelect={handleSelectSuggestion} onCopy={handleCopy} /></TiltCard>
                            ))}
                            <MotionButton variant="ghost" size="lg" onClick={() => setAiSuggestions([])} className="w-full">다시 작성하기</MotionButton>
                        </div>
                    )}

                    {selectedText && (
                        <div className="space-y-4">
                            <TiltCard className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">✅ 최종 확인</h2>
                                </div>

                                {/* Persona Selector */}
                                <div className="mb-6 bg-slate-50 p-2 rounded-2xl grid grid-cols-3 gap-2">
                                    {personas.map(p => (
                                        <button
                                            key={p.id}
                                            onClick={() => setPersona(p.id)}
                                            className={`relative p-3 rounded-xl transition-all duration-300 flex flex-col items-center gap-2 cursor-pointer ${persona === p.id ? p.activeOp : 'hover:bg-slate-200 text-slate-500'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <p.icon className="w-5 h-5" />
                                                <span className="font-bold text-sm tracking-tight">{p.label}</span>
                                            </div>
                                            <span className={`text-xs ${persona === p.id ? 'text-white/80' : 'text-slate-400'}`}>{p.desc}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Content Area */}
                                <div id="final-record-card" className={`bg-white p-8 rounded-3xl border shadow-sm mb-6 relative overflow-hidden transition-all duration-500 
                                    ${persona === 'default' ? 'border-slate-200' : ''}
                                    ${persona === 'polite' ? 'border-blue-200 shadow-blue-50' : ''}
                                    ${persona === 'soft' ? 'border-pink-200 shadow-pink-50' : ''}
                                `}>
                                    <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-20 -mt-20 opacity-40 transition-colors duration-500 
                                         ${persona === 'default' ? 'bg-slate-200' : ''}
                                         ${persona === 'polite' ? 'bg-blue-200' : ''}
                                         ${persona === 'soft' ? 'bg-pink-200' : ''}
                                    `}></div>

                                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        {persona === 'default' && <><GraduationCap className="w-5 h-5 text-slate-600" /> 유아발달상황</>}
                                        {persona === 'polite' && <><User className="w-5 h-5 text-blue-600" /> 학부모님께 (공지)</>}
                                        {persona === 'soft' && <><Smile className="w-5 h-5 text-pink-500" /> 학부모님께 (소통)</>}
                                    </h3>

                                    <textarea
                                        value={displayText}
                                        onChange={(e) => {
                                            if (persona === 'default') setSelectedText(e.target.value);
                                        }}
                                        readOnly={persona !== 'default'}
                                        className="w-full h-64 p-2 bg-transparent border border-transparent hover:border-amber-100 focus:border-amber-300 focus:ring-0 rounded-lg text-slate-700 leading-loose text-lg whitespace-pre-wrap resize-none transition-all outline-none"
                                        placeholder="내용을 수정할 수 있습니다."
                                        spellCheck={false}
                                    />
                                    <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 flex justify-between">
                                        <span>작성일: {new Date().toLocaleDateString()}</span>
                                        <span>삐약 (Ppiyak) AI 비서</span>
                                    </div>
                                </div>

                                {persona === 'default' && <ValidationReport report={validationReport} />}

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <MotionButton variant="ghost" onClick={() => setSelectedText('')}>다시 선택</MotionButton>
                                    <div className="flex gap-2 justify-end">
                                        {persona === 'default' ? (
                                            <>
                                                <MotionButton variant="secondary" onClick={() => setIsTemplateModalOpen(true)} icon={BookOpen}>템플릿 저장</MotionButton>
                                                <MotionButton variant="secondary" onClick={handleDownload} icon={FileText}>PDF</MotionButton>
                                                <MotionButton variant="primary" onClick={handleSave}>기록 저장</MotionButton>
                                            </>
                                        ) : (
                                            <MotionButton
                                                variant="secondary"
                                                onClick={handleCopyCurrent}
                                                icon={FileText}
                                                className={`
                                                    ${persona === 'polite' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : ''}
                                                    ${persona === 'soft' ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' : ''}
                                                `}
                                            >
                                                변환된 내용 복사
                                            </MotionButton>
                                        )}
                                    </div>
                                </div>
                            </TiltCard>
                        </div>
                    )}
                    <TemplateModal isOpen={isTemplateModalOpen} onClose={() => setIsTemplateModalOpen(false)} initialData={{ content: selectedText }} onSave={onSaveAsTemplate} />
                </div>
            )}
        </motion.div>
    );
}
