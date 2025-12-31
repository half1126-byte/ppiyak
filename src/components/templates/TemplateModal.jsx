import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus, Tag } from 'lucide-react';
import MotionButton from '../ui/MotionButton';

export default function TemplateModal({ isOpen, onClose, onSave, initialData }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(initialData.title || '');
            setContent(initialData.content || '');
            setTags(initialData.tags || []);
        } else if (isOpen) {
            // Reset for new entry
            setTitle('');
            setContent('');
            setTags([]);
        }
    }, [isOpen, initialData]);

    const handleAddTag = () => {
        if (currentTag.trim() && !tags.includes(currentTag.trim())) {
            setTags([...tags, currentTag.trim()]);
            setCurrentTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const handleSave = () => {
        if (!title.trim() || !content.trim()) return;
        onSave({ title, content, tags });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-800">
                            {initialData ? '템플릿 수정' : '새 템플릿 만들기'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">제목</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="예: 만 4세 2학기 창의성 예시"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-primary-500 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">내용 (5문장 권장)</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="자주 사용하는 생기부 문구를 입력하세요."
                                className="w-full h-40 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-primary-500 transition-all outline-none resize-none leading-relaxed"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">태그</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={currentTag}
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                                    placeholder="태그 입력 (Enter)"
                                    className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl focus:border-primary-500 outline-none text-sm"
                                />
                                <button onClick={handleAddTag} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600">
                                    <Plus size={20} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, i) => (
                                    <span key={i} className="px-2 py-1 bg-secondary-50 text-secondary-600 text-xs rounded-full flex items-center gap-1 font-medium border border-secondary-100">
                                        #{tag}
                                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-secondary-800"><X size={12} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                        <MotionButton variant="ghost" onClick={onClose}>취소</MotionButton>
                        <MotionButton variant="primary" icon={Save} onClick={handleSave} disabled={!title.trim() || !content.trim()}>
                            저장하기
                        </MotionButton>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
