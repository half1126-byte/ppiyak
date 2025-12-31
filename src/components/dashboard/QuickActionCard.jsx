import Card from '../Card'
import Tooltip from '../Tooltip'

export default function QuickActionCard({
    icon: Icon,
    title,
    description,
    onClick,
    color = 'peach',
    tooltip,
}) {
    const colorClasses = {
        peach: {
            icon: 'bg-peach-100 group-hover:bg-peach-600',
            iconText: 'text-peach-600 group-hover:text-white',
            border: 'hover:border-peach-500',
        },
        mint: {
            icon: 'bg-mint-100 group-hover:bg-mint-600',
            iconText: 'text-mint-600 group-hover:text-white',
            border: 'hover:border-mint-500',
        },
        lavender: {
            icon: 'bg-lavender-100 group-hover:bg-lavender-600',
            iconText: 'text-lavender-600 group-hover:text-white',
            border: 'hover:border-lavender-500',
        },
    }

    const colors = colorClasses[color] || colorClasses.peach

    const content = (
        <button
            onClick={onClick}
            className="w-full text-left group"
        >
            <Card
                hover
                className={`border-2 border-transparent transition-smooth ${colors.border}`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-smooth ${colors.icon}`}>
                        <Icon className={`w-6 h-6 transition-smooth ${colors.iconText}`} />
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-gray-900 mb-1">{title}</div>
                        <div className="text-sm text-gray-500">{description}</div>
                    </div>
                </div>
            </Card>
        </button>
    )

    if (tooltip) {
        return (
            <Tooltip content={tooltip} position="top">
                {content}
            </Tooltip>
        )
    }

    return content
}
