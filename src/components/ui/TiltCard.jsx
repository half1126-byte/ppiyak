import React from 'react';
import { motion } from 'framer-motion';

/**
 * TiltCard - Premium Soft Version
 * - Rounder (3xl)
 * - Softer shadows
 * - Gentle float on hover
 */
export default function TiltCard({ children, className = "", onClick }) {
    return (
        <motion.div
            whileHover={{
                y: -8,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`
                relative bg-white/80 backdrop-blur-xl
                border border-white/60
                rounded-3xl
                shadow-soft
                overflow-hidden
                ${className}
            `}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
}
