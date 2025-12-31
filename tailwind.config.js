/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Quicksand', 'Pretendard', 'sans-serif'],
            },
            colors: {
                // Plan B: Vibrant Pastels (Headspace/Duolingo Style)
                // High saturation, friendly, clean.
                primary: {
                    50: '#f0fcf9',
                    100: '#cbfbf0',
                    200: '#99f6e0',
                    300: '#5fe9ce',
                    400: '#2dd4bf',
                    500: '#14b8a6', // TEAL/MINT (Main Action)
                    600: '#0d9488',
                    700: '#0f766e',
                    800: '#115e59',
                    900: '#134e4a',
                },
                secondary: {
                    50: '#fff1f2',
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#f43f5e', // SOFT RED/PINK (Interactive)
                    600: '#e11d48',
                    700: '#be123c',
                    800: '#9f1239',
                    900: '#881337',
                },
                accent: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b', // AMBER/YELLOW (Highlight)
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },

                // Detailed Palettes for Components
                peach: { 50: '#fff5f0', 100: '#ffe8dc', 500: '#ff7a4c' }, // Warmth
                lavender: { 50: '#fdf4ff', 100: '#fae8ff', 500: '#d946ef' }, // Magic
                cream: { 50: '#fefdfb', 100: '#fffbe6', 500: '#fcd34d' }, // Backgrounds
            },
            boxShadow: {
                // Soft, colored shadows for "Floating" feel
                'soft': '0 8px 30px rgba(0,0,0,0.04)',
                'medium': '0 15px 35px rgba(0,0,0,0.08)',
                'large': '0 30px 60px -10px rgba(0,0,0,0.12)',
                'glow-primary': '0 0 30px rgba(20, 184, 166, 0.4)',
                'glow-secondary': '0 0 30px rgba(244, 63, 94, 0.4)',
                'dock': '0 20px 40px rgba(0,0,0,0.1)',
            },
            borderRadius: {
                '3xl': '2rem', // Super round
                '4xl': '3rem',
            },
            keyframes: {
                'float-slow': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'breathe': {
                    '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
                    '50%': { opacity: '0.8', transform: 'scale(1.1)' },
                }
            },
            animation: {
                'float': 'float-slow 8s ease-in-out infinite',
                'breathe': 'breathe 8s ease-in-out infinite',
            }
        },
    },
    plugins: [],
}
