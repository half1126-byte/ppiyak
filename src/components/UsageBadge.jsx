import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Crown, Zap } from 'lucide-react';

export default function UsageBadge({
    usageCount,
    remainingUses,
    isPremium,
    FREE_LIMIT = 10,
    onClick
}) {
    // 프리미엄 유저
    if (isPremium) {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full shadow-lg"
            >
                <Crown className="w-4 h-4" />
                <span>프리미엄</span>
            </motion.button>
        );
    }

    // 사용량 경고 레벨
    const getStatusColor = () => {
        if (remainingUses === 0) return 'from-red-500 to-rose-500';
        if (remainingUses <= 3) return 'from-amber-400 to-orange-500';
        return 'from-emerald-400 to-teal-500';
    };

    const getStatusBg = () => {
        if (remainingUses === 0) return 'bg-red-50 border-red-200';
        if (remainingUses <= 3) return 'bg-amber-50 border-amber-200';
        return 'bg-emerald-50 border-emerald-200';
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-sm font-medium transition-all ${getStatusBg()}`}
        >
            {remainingUses === 0 ? (
                <Zap className="w-4 h-4 text-red-500" />
            ) : (
                <Sparkles className="w-4 h-4 text-emerald-500" />
            )}
            <span className={`bg-gradient-to-r ${getStatusColor()} bg-clip-text text-transparent font-bold`}>
                {remainingUses === 0 ? '사용량 소진' : `${remainingUses}회 남음`}
            </span>
            <span className="text-xs text-gray-400">
                / {FREE_LIMIT}
            </span>
        </motion.button>
    );
}
