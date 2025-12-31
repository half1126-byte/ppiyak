import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Settings } from 'lucide-react';
import TiltCard from './ui/TiltCard';
import Background3D from './layout/Background3D';
import DevSettingsModal from './DevSettingsModal';
import toast from 'react-hot-toast';

export default function Login({ onLogin, onGuestLogin }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogin = async () => {
        console.log("Submit Google Login");
        toast('구글 로그인 시도 중...', { icon: '⏳' });
        setIsLoading(true);
        try {
            await onLogin();
            console.log("Google Login Triggered");
        } catch (error) {
            console.error("Login failed", error);
            toast.error(`로그인 오류: ${error.message}`);
        } finally {
            // Keep loading state briefly
            setTimeout(() => setIsLoading(false), 3000);
        }
    };

    useEffect(() => {
        // Initialize Naver Login with Dynamic Client ID
        const initNaverLogin = () => {
            const clientId = localStorage.getItem('naver_client_id');
            if (!clientId) {
                console.log("No Naver Client ID found");
                return;
            }

            if (!window.naver) {
                console.error("Naver SDK not loaded");
                toast.error("네이버 로그인 SDK가 로드되지 않았습니다.");
                return;
            }

            console.log("Initializing Naver Login...");
            try {
                const naverLogin = new window.naver.LoginWithNaverId({
                    clientId: clientId,
                    callbackUrl: window.location.origin,
                    isPopup: false,
                    loginButton: { color: "green", type: 3, height: 50 }
                });

                naverLogin.init();
                console.log("Naver Login Initialized");

                // Handle Callback (Login Success)
                naverLogin.getLoginStatus((status) => {
                    if (status) {
                        console.log("Naver Login Success:", naverLogin.user);
                        const naverUser = naverLogin.user;
                        onGuestLogin({
                            uid: `naver:${naverUser.id}`,
                            displayName: naverUser.name || '네이버 선생님',
                            email: naverUser.email,
                            photoURL: naverUser.profile_image,
                            provider: 'naver'
                        });
                        // Remove hash to clean URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                });
            } catch (err) {
                console.error("Naver Init Error", err);
            }
        };
        setTimeout(initNaverLogin, 500); // Slight delay to ensure DOM is ready
    }, [onGuestLogin]);

    const handleNaverLogin = () => {
        console.log("Click Naver Login");
        const clientId = localStorage.getItem('naver_client_id');
        if (!clientId) {
            toast.error("네이버 Client ID 설정이 필요합니다. (우측 상단 설정)");
            setIsSettingsOpen(true);
            return;
        }

        if (!window.naver) {
            toast.error("네이버 SDK 오류. 새로고침 해주세요.");
            return;
        }

        const btn = document.getElementById('naverIdLogin')?.firstChild;
        if (btn) {
            console.log("Triggering hidden Naver button");
            btn.click();
        } else {
            console.error("Naver button not found in DOM");
            toast.error("네이버 로그인 버튼을 찾을 수 없습니다. 다시 시도해주세요.");
            // Retry init?
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden font-pretendard">
            <Background3D />

            {/* Dev Settings Button */}
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full transition-all text-gray-600 hover:text-primary-600"
                title="API 키 설정"
            >
                <Settings className="w-6 h-6" />
            </button>

            <DevSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md"
            >
                <TiltCard className="p-8 md:p-12 text-center bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-tr from-peach-400 to-primary-400 rounded-3xl flex items-center justify-center shadow-lg transform rotate-6">
                            <Sparkles className="w-10 h-10 text-white" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-2">
                        알짜AI 선생님
                    </h1>
                    <p className="text-gray-500 mb-10">
                        유치원 생활기록부, AI와 함께 똑똑하게 작성하세요
                    </p>

                    <div className="space-y-3">
                        {/* Google Login */}
                        <button
                            onClick={handleLogin}
                            disabled={isLoading}
                            className="w-full relative group overflow-hidden rounded-2xl bg-white border border-gray-200 p-4 transition-all hover:bg-gray-50 hover:border-gray-300 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google"
                                    className="w-6 h-6"
                                />
                                <span className="font-semibold text-gray-700">
                                    {isLoading ? '로그인 중...' : 'Google 계정으로 시작하기'}
                                </span>
                            </div>
                        </button>

                        {/* Naver Login */}
                        <div id="naverIdLogin" className="hidden"></div>
                        <button
                            onClick={handleNaverLogin}
                            className="w-full relative group overflow-hidden rounded-2xl bg-[#03C75A] border border-transparent p-4 transition-all hover:bg-[#02b351] hover:shadow-md"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-white font-bold text-lg">N</span>
                                <span className="font-semibold text-white">
                                    네이버 아이디로 로그인
                                </span>
                            </div>
                        </button>

                        {/* Guest Login */}
                        <button
                            onClick={onGuestLogin}
                            className="w-full py-3 text-sm text-gray-500 font-medium hover:text-gray-800 transition-colors"
                        >
                            로그인 없이 체험하기 (게스트)
                        </button>
                    </div>

                    <p className="mt-8 text-xs text-gray-400">
                        © 2025 Kindergarten AI Record Generator
                    </p>
                </TiltCard>
            </motion.div>
        </div>
    );
}
