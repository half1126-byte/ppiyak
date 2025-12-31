import React from 'react';
import { FileText, MessageCircle, CheckSquare, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ModeSelector - Floating Dock (Plan B Colors)
 */
export default function ModeSelector({ currentMode, onModeChange }) {
    const modes = [
        { id: 'form', label: '기본 작성', icon: FileText, desc: '폼 입력', color: 'bg-primary-500' },
        { id: 'free', label: '자유 작성', icon: Wand2, desc: 'AI 변환', color: 'bg-indigo-500' },
        { id: 'checklist', label: '체크리스트', icon: CheckSquare, desc: '상세 선택', color: 'bg-secondary-500' }
    ];

    return (
        <div className="mb-8 overflow-x-auto pb-4 no-scrollbar">
            <div className="bg-white/60 backdrop-blur-2xl rounded-[2rem] p-2 border border-white/60 shadow-dock flex min-w-max md:min-w-0 md:flex-row gap-2">
                {modes.map(mode => {
                    const Icon = mode.icon;
                    const isActive = currentMode === mode.id;

                    return (
                        <motion.button
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            className={`
                                relative flex-1 p-4 rounded-[1.5rem] transition-all
                                flex items-center gap-3 text-left group min-w-[140px]
                                ${isActive ? 'text-white' : 'text-slate-600 hover:bg-white/50'}
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {/* Active Bubble */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeMode"
                                    className={`absolute inset-0 rounded-[1.5rem] ${mode.color} shadow-lg`}
                                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                />
                            )}

                            <div className="relative z-10 p-2 bg-white/20 rounded-xl">
                                <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                            </div>

                            <div className="relative z-10">
                                <span className={`block font-bold text-lg leading-tight ${isActive ? 'text-white' : 'text-slate-700'}`}>
                                    {mode.label}
                                </span>
                                <span className={`text-sm ${isActive ? 'text-white/90' : 'text-slate-400'}`}>
                                    {mode.desc}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
