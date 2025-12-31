import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Edit, Trash2, Copy, FileText, Check } from 'lucide-react';
import TiltCard from '../ui/TiltCard';
import MotionButton from '../ui/MotionButton';
import toast from 'react-hot-toast';

export default function TemplateCard({ template, onUse, onEdit, onDelete }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(template.content);
        toast.success('템플릿 내용이 복사되었습니다');
    };

    return (
        <TiltCard className="h-full flex flex-col justify-between p-6">
            <div>
                <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                        {template.tags?.map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        <button onClick={onEdit} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                            <Edit size={16} />
                        </button>
                        <button onClick={() => onDelete(template.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{template.title}</h3>

                <div className="relative group cursor-pointer" onClick={onUse}>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-4 bg-slate-50 p-3 rounded-xl border border-slate-100 group-hover:border-primary-200 group-hover:bg-primary-50/50 transition-all">
                        {template.content}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <span className="bg-primary-500 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg transform scale-95 group-hover:scale-105 transition-transform">
                            이 템플릿 사용하기
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <MotionButton variant="primary" size="sm" icon={Sparkles} onClick={onUse} className="flex-1">
                    사용하기
                </MotionButton>
                <MotionButton variant="ghost" size="sm" icon={Copy} onClick={handleCopy} className="text-slate-500">
                    복사
                </MotionButton>
            </div>
        </TiltCard>
    );
}
