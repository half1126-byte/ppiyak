import clsx from 'clsx'

export default function Card({
    children,
    header,
    footer,
    padding = 'md',
    hover = false,
    glass = false,
    className,
    ...props
}) {
    const paddingSizes = {
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    }

    return (
        <div
            className={clsx(
                'rounded-2xl transition-smooth',
                glass ? 'glass' : 'bg-white shadow-soft',
                hover && 'hover:shadow-medium hover:-translate-y-1',
                className
            )}
            {...props}
        >
            {header && (
                <div className={clsx('border-b border-gray-100', paddingSizes[padding])}>
                    {header}
                </div>
            )}
            <div className={paddingSizes[padding]}>
                {children}
            </div>
            {footer && (
                <div className={clsx('border-t border-gray-100', paddingSizes[padding])}>
                    {footer}
                </div>
            )}
        </div>
    )
}
