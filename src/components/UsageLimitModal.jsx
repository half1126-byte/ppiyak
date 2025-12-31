import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Sparkles, AlertTriangle } from 'lucide-react';

export default function UsageLimitModal({
    isOpen,
    onClose,
    usageCount,
    onUpgrade,
    FREE_LIMIT = 10
}) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 p-8 text-center">
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                        >
                            <X className="w-5 h-5 text-white" />
                        </button>

                        <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                            <Crown className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            무료 사용량을 모두 사용했어요
                        </h2>
                        <p className="text-white/80 text-sm">
                            {FREE_LIMIT}회 무료 사용 완료 ({usageCount}/{FREE_LIMIT})
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-amber-800">베타 서비스 안내</p>
                                    <p className="text-sm text-amber-600 mt-1">
                                        현재 베타 버전으로 운영 중입니다.
                                        정식 출시 시 프리미엄 플랜이 제공됩니다.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
                            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500" />
                                프리미엄 혜택
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 무제한 AI 문장 생성
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 클라우드 동기화 (모든 기기)
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 고급 템플릿 제공
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-500">✓</span> 우선 고객 지원
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-0 space-y-3">
                        <button
                            onClick={onUpgrade}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Crown className="w-5 h-5" />
                            프리미엄 시작하기 (베타 무료 체험)
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
                        >
                            나중에 할게요
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
