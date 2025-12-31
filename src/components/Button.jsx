import { forwardRef } from 'react'
import clsx from 'clsx'

const Button = forwardRef(({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    className,
    ...props
}, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-touch'

    const variants = {
        primary: 'bg-gradient-to-r from-peach-500 to-peach-600 hover:from-peach-600 hover:to-peach-700 text-white shadow-soft hover:shadow-medium focus:ring-peach-500',
        secondary: 'bg-gradient-to-r from-mint-500 to-mint-600 hover:from-mint-600 hover:to-mint-700 text-white shadow-soft hover:shadow-medium focus:ring-mint-500',
        lavender: 'bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white shadow-soft hover:shadow-medium focus:ring-lavender-500',
        ghost: 'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 focus:ring-gray-400',
        outline: 'bg-transparent hover:bg-peach-50 text-peach-600 border-2 border-peach-500 hover:border-peach-600 focus:ring-peach-500',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm gap-2',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-8 py-4 text-lg gap-3',
    }

    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {loading && (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
            {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
            {children}
            {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
