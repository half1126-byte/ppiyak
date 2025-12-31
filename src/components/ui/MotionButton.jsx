import React from 'react';
import { motion } from 'framer-motion';

/**
 * MotionButton - Gummy Physics
 */
export default function MotionButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    className = "",
    disabled = false
}) {
    const variants = {
        primary: "bg-primary-500 text-white shadow-glow-primary hover:bg-primary-600",
        secondary: "bg-secondary-500 text-white shadow-glow-secondary hover:bg-secondary-600",
        ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm rounded-xl",
        md: "px-6 py-3 text-base rounded-2xl",
        lg: "px-8 py-4 text-lg font-bold rounded-2xl"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            onClick={onClick}
            disabled={disabled}
            className={`
                flex items-center justify-center gap-2 font-bold
                disabled:opacity-50 disabled:cursor-not-allowed
                ${sizes[size]}
                ${variants[variant]}
                ${className}
            `}
        >
            {Icon && <Icon className="w-5 h-5" />}
            {children}
        </motion.button>
    );
}
