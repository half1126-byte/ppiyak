import React from 'react';
import { motion } from 'framer-motion';
import { FileText, BookOpen, Clock, CheckCircle2, TrendingUp } from 'lucide-react';
import TiltCard from '../components/ui/TiltCard';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActionCard from '../components/dashboard/QuickActionCard';
import RecentWorksList from '../components/dashboard/RecentWorksList';

export default function DashboardView({
    stats,
    recentWorks,
    setCurrentView,
    setCurrentInputMode,
    handleCopy
}) {
    return (
        <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <TiltCard>
                <div className="p-8 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 backdrop-blur-sm rounded-3xl">
                    <WelcomeCard
                        stats={stats}
                        onCreateNew={() => { setCurrentView('create'); setCurrentInputMode('form'); }}
                    />
                </div>
            </TiltCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <TiltCard className="p-6">
                        <StatsCard icon={CheckCircle2} label="작성 완료" value={`${stats.completed}건`} color="mint" />
                    </TiltCard>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <TiltCard className="p-6">
                        <StatsCard icon={Clock} label="작성 중" value={`${stats.pending}건`} color="peach" />
                    </TiltCard>
                </motion.div>
                <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <TiltCard className="p-6">
                        <StatsCard icon={TrendingUp} label="이번 주" value={`+${stats.thisWeek}`} color="lavender" />
                    </TiltCard>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-secondary-500 rounded-full inline-block"></span>
                        빠른 작업
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TiltCard className="p-1 cursor-pointer" onClick={() => setCurrentView('create')}>
                            <QuickActionCard icon={FileText} title="새 기록 작성" description="AI와 함께 생기부를 작성해보세요" variant="primary" />
                        </TiltCard>
                        <TiltCard className="p-1 cursor-pointer" onClick={() => setCurrentView('templates')}>
                            <QuickActionCard icon={BookOpen} title="템플릿 관리" description="자주 쓰는 문구를 관리하세요" variant="secondary" />
                        </TiltCard>
                    </div>
                </div>
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="w-2 h-8 bg-accent-500 rounded-full inline-block"></span>
                        최근 활동
                    </h2>
                    <TiltCard className="p-4">
                        <RecentWorksList works={recentWorks} onCopy={handleCopy} />
                    </TiltCard>
                </div>
            </div>
        </motion.div>
    );
}
