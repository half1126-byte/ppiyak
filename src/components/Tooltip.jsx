import { useState } from 'react'
import clsx from 'clsx'

export default function Tooltip({
    children,
    content,
    position = 'top',
    className,
}) {
    const [isVisible, setIsVisible] = useState(false)

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    }

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
    }

    if (!content) return children

    return (
        <div
            className={clsx('relative inline-block', className)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            {isVisible && (
                <div
                    className={clsx(
                        'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg whitespace-nowrap',
                        'animate-fade-in pointer-events-none',
                        positions[position]
                    )}
                >
                    {content}
                    <div
                        className={clsx(
                            'absolute w-0 h-0 border-4',
                            arrows[position]
                        )}
                    />
                </div>
            )}
        </div>
    )
}
