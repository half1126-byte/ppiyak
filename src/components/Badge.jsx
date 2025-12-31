import clsx from 'clsx'

export default function Badge({
    children,
    variant = 'default',
    size = 'md',
    className,
    ...props
}) {
    const variants = {
        default: 'bg-gray-100 text-gray-700',
        success: 'bg-mint-100 text-mint-700',
        warning: 'bg-soft-yellow-100 text-soft-yellow-700',
        error: 'bg-red-100 text-red-700',
        info: 'bg-lavender-100 text-lavender-700',
        peach: 'bg-peach-100 text-peach-700',
    }

    const sizes = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-1.5 text-base',
    }

    return (
        <span
            className={clsx(
                'inline-flex items-center font-medium rounded-full',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}
