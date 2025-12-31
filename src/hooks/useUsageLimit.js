import { useState, useEffect, useCallback } from 'react';

const FREE_LIMIT = 10;
const STORAGE_KEY = 'ppiyak_usage_count';

/**
 * 사용량 제한 훅 (베타)
 * - 무료 10회 사용 가능
 * - localStorage로 사용량 추적
 * - 나중에 Firebase/서버 연동 예정
 */
export function useUsageLimit() {
    const [usageCount, setUsageCount] = useState(0);
    const [isPremium, setIsPremium] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);

    // 초기화: localStorage에서 사용량 불러오기
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setUsageCount(parseInt(saved, 10) || 0);
        }

        // 프리미엄 상태 확인 (베타: 항상 false)
        const premium = localStorage.getItem('ppiyak_premium') === 'true';
        setIsPremium(premium);
    }, []);

    // 사용량 증가
    const incrementUsage = useCallback(() => {
        if (isPremium) return true; // 프리미엄은 무제한

        const newCount = usageCount + 1;

        if (newCount > FREE_LIMIT) {
            setShowLimitModal(true);
            return false; // 제한 도달
        }

        setUsageCount(newCount);
        localStorage.setItem(STORAGE_KEY, newCount.toString());
        return true; // 사용 가능
    }, [usageCount, isPremium]);

    // 남은 사용 횟수
    const remainingUses = Math.max(0, FREE_LIMIT - usageCount);

    // 제한 도달 여부
    const isLimitReached = !isPremium && usageCount >= FREE_LIMIT;

    // 모달 닫기
    const closeLimitModal = useCallback(() => {
        setShowLimitModal(false);
    }, []);

    // 프리미엄 업그레이드 (베타: 테스트용)
    const upgradeToPremium = useCallback(() => {
        // 나중에 실제 결제 로직으로 대체
        localStorage.setItem('ppiyak_premium', 'true');
        setIsPremium(true);
        setShowLimitModal(false);
    }, []);

    // 사용량 초기화 (테스트용)
    const resetUsage = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('ppiyak_premium');
        setUsageCount(0);
        setIsPremium(false);
    }, []);

    return {
        usageCount,
        remainingUses,
        isLimitReached,
        isPremium,
        showLimitModal,
        incrementUsage,
        closeLimitModal,
        upgradeToPremium,
        resetUsage,
        FREE_LIMIT
    };
}
