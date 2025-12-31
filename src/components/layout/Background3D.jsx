import React from 'react';
import { motion } from 'framer-motion';

/**
 * Premium Soft Background
 * - Slow breathing gradient blobs
 * - Clean, airy feel
 */
export default function Background3D() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#f8fafc]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-secondary-50/30" />

            {/* Soft Breathing Blobs */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-[120px]"
            />

            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -30, 0],
                    opacity: [0.3, 0.4, 0.3]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-secondary-200/40 rounded-full blur-[100px]"
            />

            <motion.div
                animate={{
                    y: [0, -40, 0],
                    opacity: [0.2, 0.3, 0.2]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-[-20%] left-[30%] w-[800px] h-[600px] bg-accent-100/50 rounded-full blur-[150px]"
            />
        </div>
    );
}
