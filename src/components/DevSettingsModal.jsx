import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Key } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DevSettingsModal({ isOpen, onClose }) {
    const [naverClientId, setNaverClientId] = useState('');
    const [firebaseConfig, setFirebaseConfig] = useState('');

    useEffect(() => {
        if (isOpen) {
            const savedNaver = localStorage.getItem('naver_client_id');
            const savedFirebase = localStorage.getItem('firebase_config_override');
            if (savedNaver) setNaverClientId(savedNaver);
            if (savedFirebase) setFirebaseConfig(savedFirebase);
        }
    }, [isOpen]);

    const handleSave = () => {
        if (naverClientId.trim()) {
            localStorage.setItem('naver_client_id', naverClientId.trim());
        }

        if (firebaseConfig.trim()) {
            try {
                // Validate JSON
                JSON.parse(firebaseConfig);
                localStorage.setItem('firebase_config_override', firebaseConfig.trim());
            } catch (e) {
                toast.error('Firebase 설정이 올바른 JSON 형식이 아닙니다.');
                return;
            }
        }

        toast.success('설정이 저장되었습니다. 페이지를 새로고침합니다.');
        setTimeout(() => window.location.reload(), 1000);
    };

    const handleReset = () => {
        if (window.confirm('모든 설정을 초기화하시겠습니까?')) {
            localStorage.removeItem('naver_client_id');
            localStorage.removeItem('firebase_config_override');
            toast.success('초기화되었습니다.');
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Key className="w-5 h-5 text-primary-500" />
                                <h2 className="text-xl font-bold text-gray-800">개발자 설정 (Real Login)</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700">
                                💡 실제 로그인을 사용하려면 API 키가 필요합니다.<br />
                                키는 무료로 발급받을 수 있습니다.
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Naver Client ID
                                </label>
                                <input
                                    type="text"
                                    value={naverClientId}
                                    onChange={(e) => setNaverClientId(e.target.value)}
                                    placeholder="예: ABCdefGHIjlk1234..."
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-mono text-sm"
                                />
                                <p className="mt-1.5 text-xs text-gray-500">
                                    * 네이버 개발자 센터 &gt; 내 애플리케이션 &gt; Client ID 복사
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Firebase Config (JSON)
                                </label>
                                <textarea
                                    value={firebaseConfig}
                                    onChange={(e) => setFirebaseConfig(e.target.value)}
                                    placeholder='{"apiKey": "...", "authDomain": "..."}'
                                    className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all font-mono text-xs"
                                />
                                <p className="mt-1.5 text-xs text-gray-500">
                                    * Firebase 콘솔 &gt; 프로젝트 설정 &gt; SDK 설정(JSON) 전체 복사
                                </p>
                            </div>
                        </div>

                        <div className="p-6 bg-gray-50 flex items-center justify-between">
                            <button
                                onClick={handleReset}
                                className="text-sm text-gray-500 hover:text-red-500 underline decoration-dotted"
                            >
                                설정 초기화
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-lg shadow-lg shadow-primary-200 transition-all flex items-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    저장 및 적용
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
