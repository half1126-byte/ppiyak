import { forwardRef } from 'react'
import clsx from 'clsx'

const Input = forwardRef(({
    label,
    error,
    helperText,
    icon: Icon,
    className,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        'w-full px-4 py-3 rounded-xl border-2 transition-smooth',
                        'focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent',
                        'placeholder:text-gray-400',
                        'min-h-touch text-gray-900',
                        error
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-white hover:border-gray-300',
                        Icon && 'pl-12',
                        className
                    )}
                    {...props}
                />
            </div>
            {(error || helperText) && (
                <p className={clsx(
                    'mt-2 text-sm',
                    error ? 'text-red-600' : 'text-gray-500'
                )}>
                    {error || helperText}
                </p>
            )}
        </div>
    )
})

Input.displayName = 'Input'

export default Input
