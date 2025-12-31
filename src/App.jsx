// force change
import { useState, useEffect, Suspense, lazy, useCallback, useMemo } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Bird, FileText, BookOpen } from 'lucide-react';
import { validateIntegrated } from './utils/validator';
import { generatePDF } from './utils/pdfGenerator';
import { refineText } from './utils/textRefiner';
import { AnimatePresence, motion } from 'framer-motion';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';

// Shared Components
import Background3D from './components/layout/Background3D';
import MotionButton from './components/ui/MotionButton';
import Login from './components/Login';
import UsageLimitModal from './components/UsageLimitModal';
import UsageBadge from './components/UsageBadge';
import { useFirestore } from './hooks/useFirestore';
import { useUsageLimit } from './hooks/useUsageLimit';
import { auth, loginWithGoogle, logout } from './utils/firebase';

// Lazy Loaded Views
const DashboardView = lazy(() => import('./views/DashboardView'));
const CreateView = lazy(() => import('./views/CreateView'));
const TemplatesView = lazy(() => import('./views/TemplatesView'));

const LoadingScreen = () => (
    <div className="w-full h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
    </div>
);

function App() {
    // Auth State
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Firestore Hook
    const { records: recentWorks, saveRecord } = useFirestore(user);

    // Usage Limit Hook (베타)
    const {
        usageCount,
        remainingUses,
        isLimitReached,
        isPremium,
        showLimitModal,
        incrementUsage,
        closeLimitModal,
        upgradeToPremium,
        FREE_LIMIT
    } = useUsageLimit();

    const [currentView, setCurrentView] = useState('dashboard');
    const [currentInputMode, setCurrentInputMode] = useState('form');
    const [templates, setTemplates] = useState([]);

    const [formData, setFormData] = useState({
        studentName: '',
        age: '',
        period: '',
        activity: '',
        observation: ''
    });

    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [selectedText, setSelectedText] = useState('');
    const [validationReport, setValidationReport] = useState(null);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

    // Auth Listener & Redirect Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });

        // Check for redirect result (Google Login)
        getRedirectResult(auth).then((result) => {
            if (result?.user) {
                setUser(result.user);
                toast.success(`환영합니다, ${result.user.displayName} 선생님!`);
            }
        }).catch(error => {
            console.error("Redirect login failed", error);
            // toast.error("로그인에 실패했습니다.");
        });

        return () => unsubscribe();
    }, []);

    // Stats - derived from firestore records with useMemo
    const stats = useMemo(() => {
        if (!recentWorks) return { completed: 0, pending: 0, thisWeek: 0 };

        const now = new Date();
        const weekMs = 7 * 24 * 60 * 60 * 1000;

        return {
            completed: recentWorks.length,
            pending: 0,
            thisWeek: recentWorks.filter(r => {
                const d = new Date(r.createdAt);
                return (now - d) < weekMs;
            }).length
        };
    }, [recentWorks]);

    // LocalStorage for TEMPLATES only
    useEffect(() => {
        const saved = localStorage.getItem('saenggibu_data');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setTemplates(data.templates || []);
            } catch (e) {
                console.error('Failed to load data', e);
            }
        }
    }, []);

    const handleGenerateAI = async () => {
        if (!formData.observation) return;

        // 사용량 체크 (베타)
        if (!incrementUsage()) {
            return; // 제한 도달 시 모달 표시됨
        }

        const loadingToast = toast.loading('전문가 규칙에 맞춰 문장을 생성 중입니다...');

        // Mocking AI Generation with strict logic
        setTimeout(() => {
            const baseEvidence = formData.observation;
            const context = formData.period + ' ' + formData.activity;
            const name = formData.studentName || '유아';

            // Template 1: Creative Focus (5 Sentences)
            const draft1 = `
        ${name}는 ${context} 상황에서 ${baseEvidence} 모습을 보임.
        친구들과 함께 놀이를 확장하며 새로운 아이디어를 제안하는 등 창의적인 태도를 나타냄.
        활동 도구를 능숙하게 사용하며 소근육 조절 능력이 발달된 모습을 보임.
        자신의 생각을 구체적인 언어로 표현하며 또래와의 의사소통을 즐김.
        자연물이나 주변 사물의 변화에 관심을 가지고 지속적으로 탐구하는 태도를 유지함.
        `;

            // Template 2: Social Focus (5 Sentences)
            const draft2 = `
        ${context} 활동 중 ${baseEvidence} 하며 친구를 배려하는 태도를 보임.
        갈등 상황에서 자신의 감정을 솔직하게 표현하고 타인의 입장을 이해하려 노력함.
        규칙을 준수하며 공동의 목표를 위해 협력하는 모습이 인상적임.
        신체 활동에 적극적으로 참여하며 건강한 생활 습관을 형성해가고 있음.
        노래와 움직임을 통해 자신의 경험을 다양하게 표현하는 예술적 감수성을 보임.
        `;

            // Template 3: Developmental Focus (5 Sentences)
            const draft3 = `
        ${name}는 ${context} 활동에서 ${baseEvidence} 행동을 통해 끈기 있는 모습을 보임.
        스스로 문제를 해결하려는 의지를 보이며 탐구 과정 자체를 즐김.
        경험한 내용을 문장으로 구성하여 조리 있게 말하며 언어 표현력이 확장됨.
        다양한 예술 재료를 활용하여 독창적인 작품을 만드는 것에 흥미를 느낌.
        친구의 의견을 경청하고 존중하며 원만한 사회적 관계를 형성하고 있음.
        `;

            const suggestions = [
                { id: 1, text: refineText(draft1), tag: '창의성' },
                { id: 2, text: refineText(draft2), tag: '사회성' },
                { id: 3, text: refineText(draft3), tag: '발달' }
            ];

            setAiSuggestions(suggestions);
            toast.dismiss(loadingToast);
            toast.success('전문가 기준(5문장, ~함/임)에 맞춘 문장이 생성되었습니다! ✨');
        }, 1500);
    };

    const handleSelectSuggestion = (text) => {
        const validation = validateIntegrated(text);
        setValidationReport(validation);
        setSelectedText(text);
    };

    const handleSaveAsTemplate = (templateData) => {
        const newTemplate = {
            id: Date.now(),
            ...templateData,
            createdAt: new Date().toISOString()
        };
        const updated = [newTemplate, ...templates];
        setTemplates(updated);
        localStorage.setItem('saenggibu_data', JSON.stringify({ templates: updated }));
        setIsTemplateModalOpen(false);
        toast.success('템플릿이 저장되었습니다!');
    };

    const handleSave = async () => {
        const newWork = {
            studentName: formData.studentName,
            age: formData.age,
            date: new Date().toLocaleDateString(),
            content: selectedText,
            status: 'completed',
            tags: validationReport?.tags || []
        };

        await saveRecord(newWork);

        toast.success('클라우드에 안전하게 저장되었습니다!');
        setCurrentView('dashboard');
        setFormData({ studentName: '', age: '', period: '', activity: '', observation: '' });
        setAiSuggestions([]);
        setSelectedText('');
        setValidationReport(null);
    };

    const handleCopy = useCallback((text) => {
        navigator.clipboard.writeText(text);
        toast.success('클립보드에 복사되었습니다');
    }, []);

    // Template usage handler
    const handleUseTemplate = useCallback((template) => {
        setFormData(prev => ({
            ...prev,
            observation: template.content
        }));
        setCurrentView('create');
        toast.success('템플릿이 적용되었습니다!');
    }, []);

    const handleDownload = async () => {
        const success = await generatePDF('final-record-card', formData.studentName || '유아');
        if (success) toast.success('PDF로 저장되었습니다!');
    };

    if (authLoading) return <LoadingScreen />;

    const handleGuestLogin = (customUser) => {
        setUser(customUser || {
            uid: 'guest-123',
            displayName: '게스트 선생님',
            photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
            email: 'guest@example.com'
        });
        toast.success(`로그인되었습니다! (${customUser ? customUser.displayName : '게스트'})`);
    };

    const handleGoogleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error("Google verify failed, falling back to guest", error);
            handleGuestLogin({
                uid: 'google-fallback-' + Date.now(),
                displayName: '체험용 선생님',
                email: 'demo@example.com',
                photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
            });
            toast.success("개발 모드: 체험 계정으로 접속합니다.");
        }
    };
    if (!user) return <Login onLogin={handleGoogleLogin} onGuestLogin={handleGuestLogin} />;

    return (
        <div className="min-h-screen relative font-sans text-gray-800 overflow-x-hidden selection:bg-pink-100 selection:text-pink-900">
            <Background3D />
            <Toaster position="top-center" />

            {/* Header */}
            <header className="fixed top-0 w-full z-40 transition-all duration-300 glass-premium border-b-0 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => setCurrentView('dashboard')}
                    >
                        <motion.div
                            whileHover={{ rotate: 20 }}
                            transition={{ duration: 0.3, type: "spring" }}
                            className="bg-gradient-to-tr from-yellow-400 to-orange-400 p-2.5 rounded-2xl shadow-glow"
                        >
                            <Bird className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                            삐약 <span className="text-sm font-normal text-slate-400 ml-1">AI 선생님 비서</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <UsageBadge
                            usageCount={usageCount}
                            remainingUses={remainingUses}
                            isPremium={isPremium}
                            FREE_LIMIT={FREE_LIMIT}
                        />
                        {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />}
                        {user.displayName && <span className="text-sm text-gray-600 font-medium hidden sm:inline">{user.displayName} 선생님</span>}
                        <MotionButton variant="ghost" size="sm" onClick={logout} className="text-slate-500 hover:text-red-500">로그아웃</MotionButton>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
                <AnimatePresence mode="wait">
                    <Suspense fallback={<LoadingScreen />}>
                        {currentView === 'dashboard' && (
                            <DashboardView
                                key="dashboard"
                                stats={stats}
                                recentWorks={recentWorks}
                                setCurrentView={setCurrentView}
                                setCurrentInputMode={setCurrentInputMode}
                                handleCopy={handleCopy}
                            />
                        )}

                        {currentView === 'create' && (
                            <CreateView
                                key="create"
                                currentInputMode={currentInputMode}
                                setCurrentInputMode={setCurrentInputMode}
                                setCurrentView={setCurrentView}
                                formData={formData}
                                setFormData={setFormData}
                                aiSuggestions={aiSuggestions}
                                setAiSuggestions={setAiSuggestions}
                                selectedText={selectedText}
                                setSelectedText={setSelectedText}
                                validationReport={validationReport}
                                handleGenerateAI={handleGenerateAI}
                                handleSelectSuggestion={handleSelectSuggestion}
                                handleCopy={handleCopy}
                                handleDownload={handleDownload}
                                handleSave={handleSave}
                                onSaveAsTemplate={handleSaveAsTemplate}
                            />
                        )}

                        {currentView === 'templates' && (
                            <TemplatesView
                                key="templates"
                                setCurrentView={setCurrentView}
                                onUseTemplate={handleUseTemplate}
                            />
                        )}
                    </Suspense>
                </AnimatePresence>
            </main>

            {/* Usage Limit Modal */}
            <UsageLimitModal
                isOpen={showLimitModal}
                onClose={closeLimitModal}
                usageCount={usageCount}
                onUpgrade={upgradeToPremium}
                FREE_LIMIT={FREE_LIMIT}
            />
        </div>
    );
}

export default App;
