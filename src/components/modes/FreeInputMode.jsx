import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Eraser, CheckCircle2, AlertCircle } from 'lucide-react';
import TiltCard from '../ui/TiltCard';
import MotionButton from '../ui/MotionButton';
import { refineText } from '../../utils/textRefiner';
import toast from 'react-hot-toast';

export default function FreeInputMode({ onGenerate, onBack }) {
    const [text, setText] = useState('');
    const [refined, setRefined] = useState('');
    const [metrics, setMetrics] = useState({ length: 0, sentences: 0 });

    const handleRefine = () => {
        if (!text.trim()) {
            toast.error('내용을 입력해주세요!');
            return;
        }

        const loading = toast.loading('AI 선생님이 문장을 다듬고 있어요...');
        setTimeout(() => {
            const result = refineText(text);
            setRefined(result);

            // Calc metrics
            const length = result.length;
            const sentences = result.split('.').filter(s => s.trim().length > 0).length;
            setMetrics({ length, sentences });

            toast.dismiss(loading);
            toast.success('문장이 알짜AI 지침대로 변환되었어요! ✨');
        }, 1000);
    };

    const handleUse = () => {
        if (!refined) return;
        onGenerate({ observation: refined }); // Pass to parent
    };

    return (
        <div className="space-y-6">
            <MotionButton onClick={onBack} variant="ghost" className="pl-0 text-slate-500">← 뒤로 가기</MotionButton>

            <TiltCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-accent-100 p-3 rounded-2xl">
                        <Wand2 className="w-6 h-6 text-accent-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">자유 작성 모드</h2>
                        <p className="text-slate-500">생각나는 대로 적으면 AI가 생기부 말투(~함/임)로 고쳐드려요.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="예시: 철수가 블록놀이를 좋아해요. 친구한테 양보도 잘하고 만들기도 잘하는데 가끔 고집을 부려요."
                        className="w-full h-40 p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-400 transition-all resize-none text-lg leading-relaxed placeholder:text-slate-300"
                    />

                    <div className="flex justify-end gap-3">
                        <MotionButton variant="ghost" icon={Eraser} onClick={() => setText('')}>지우기</MotionButton>
                        <MotionButton variant="primary" icon={Wand2} onClick={handleRefine}>AI 문장 다듬기</MotionButton>
                    </div>
                </div>
            </TiltCard>

            {refined && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <TiltCard className="p-8 border-2 border-primary-100 bg-primary-50/30">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-primary-500" />
                            변환 결과 확인 및 수정
                        </h3>

                        <div className="bg-white p-2 rounded-2xl border border-primary-100 shadow-sm mb-6">
                            <textarea
                                value={refined}
                                onChange={(e) => setRefined(e.target.value)}
                                className="w-full h-40 p-4 bg-transparent border-none focus:ring-0 text-lg leading-loose text-slate-700 resize-none"
                            />
                        </div>

                        {/* Analysis Chips */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${metrics.sentences >= 3 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                {metrics.sentences >= 5 ? '✅' : '⚠️'} {metrics.sentences}문장 (권장: 5)
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${metrics.length <= 500 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                {metrics.length <= 500 ? '✅' : '⚠️'} {metrics.length}자 (최대 500)
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 flex items-center gap-1">
                                ✅ ~함/임 종결
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-700 flex items-center gap-1">
                                ✅ 이름 익명화
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
                            <span>* 마음에 들지 않는 부분은 직접 수정할 수 있어요.</span>
                        </div>

                        <div className="flex justify-end">
                            <MotionButton variant="primary" size="lg" onClick={handleUse}>이 내용 확정하기</MotionButton>
                        </div>
                    </TiltCard>
                </motion.div>
            )}
        </div>
    );
}
