import { forwardRef } from 'react'
import clsx from 'clsx'

const Select = forwardRef(({
    label,
    error,
    helperText,
    children,
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
            <select
                ref={ref}
                className={clsx(
                    'w-full px-4 py-3 rounded-xl border-2 transition-smooth',
                    'focus:outline-none focus:ring-2 focus:ring-peach-500 focus:border-transparent',
                    'bg-white appearance-none cursor-pointer',
                    'min-h-touch',
                    error
                        ? 'border-red-300 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300',
                    className
                )}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.75rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                    paddingRight: '2.5rem',
                }}
                {...props}
            >
                {children}
            </select>
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

Select.displayName = 'Select'

export default Select
