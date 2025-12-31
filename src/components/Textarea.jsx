import { forwardRef } from 'react'
import clsx from 'clsx'

const Textarea = forwardRef(({
    label,
    error,
    helperText,
    showCount = false,
    maxLength,
    value = '',
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
            <textarea
                ref={ref}
                value={value}
                maxLength={maxLength}
                className={clsx(
                    'w-full px-4 py-3 rounded-xl border-2 transition-smooth resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent',
                    'placeholder:text-gray-400',
                    error
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300',
                    className
                )}
                {...props}
            />
            <div className="mt-2 flex items-center justify-between">
                {(error || helperText) && (
                    <p className={clsx(
                        'text-sm',
                        error ? 'text-red-600' : 'text-gray-500'
                    )}>
                        {error || helperText}
                    </p>
                )}
                {showCount && maxLength && (
                    <p className="text-xs text-gray-600 font-medium ml-auto">
                        {value.length} / {maxLength}
                    </p>
                )}
            </div>
        </div>
    )
})

Textarea.displayName = 'Textarea'

export default Textarea
