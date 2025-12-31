import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Plus, Filter } from 'lucide-react';
import TiltCard from '../components/ui/TiltCard';
import MotionButton from '../components/ui/MotionButton';
import { useTemplates } from '../hooks/useTemplates';
import TemplateCard from '../components/templates/TemplateCard';
import TemplateModal from '../components/templates/TemplateModal';
import { auth } from '../utils/firebase';
import toast from 'react-hot-toast';

export default function TemplatesView({ setCurrentView, onUseTemplate }) {
    const { templates, addTemplate, updateTemplate, deleteTemplate } = useTemplates(auth.currentUser);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);

    // Get all unique tags
    const allTags = [...new Set(templates.flatMap(t => t.tags || []))];

    // Filter Logic
    const filteredTemplates = templates.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTag = selectedTag ? t.tags?.includes(selectedTag) : true;
        return matchesSearch && matchesTag;
    });

    const handleSaveTemplate = async (data) => {
        if (editingTemplate) {
            await updateTemplate(editingTemplate.id, data);
            toast.success('템플릿이 수정되었습니다');
        } else {
            await addTemplate(data);
            toast.success('새 템플릿이 추가되었습니다');
        }
        setEditingTemplate(null);
    };

    const handleEdit = (template) => {
        setEditingTemplate(template);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('정말 이 템플릿을 삭제하시겠습니까?')) {
            await deleteTemplate(id);
            toast.success('템플릿이 삭제되었습니다');
        }
    };

    return (
        <motion.div key="templates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <MotionButton onClick={() => setCurrentView('dashboard')} variant="ghost" className="pl-0">← 대시보드로 돌아가기</MotionButton>
                <div className="flex w-full md:w-auto gap-2">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="템플릿 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
                        />
                    </div>
                    <MotionButton variant="primary" icon={Plus} onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }}>
                        새 템플릿
                    </MotionButton>
                </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 pb-2">
                    <button
                        onClick={() => setSelectedTag(null)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedTag ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                    >
                        전체
                    </button>
                    {allTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedTag === tag ? 'bg-secondary-500 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredTemplates.map(template => (
                        <motion.div
                            key={template.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <TemplateCard
                                template={template}
                                onUse={() => onUseTemplate(template)}
                                onEdit={() => handleEdit(template)}
                                onDelete={handleDelete}
                            />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="col-span-full py-20 text-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">저장된 템플릿이 없습니다</p>
                        <p className="text-sm mt-2">새로운 템플릿을 만들어보세요!</p>
                    </div>
                )}
            </div>

            <TemplateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTemplate}
                initialData={editingTemplate}
            />
        </motion.div>
    );
}
