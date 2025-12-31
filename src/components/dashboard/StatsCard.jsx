import Card from '../Card'

export default function StatsCard({
    icon: Icon,
    label,
    value,
    color = 'mint',
}) {
    const colorClasses = {
        mint: {
            bg: 'bg-mint-100',
            icon: 'text-mint-600',
        },
        peach: {
            bg: 'bg-peach-100',
            icon: 'text-peach-600',
        },
        lavender: {
            bg: 'bg-lavender-100',
            icon: 'text-lavender-600',
        },
        yellow: {
            bg: 'bg-soft-yellow-100',
            icon: 'text-soft-yellow-600',
        },
    }

    const colors = colorClasses[color] || colorClasses.mint

    return (
        <Card className="animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-sm text-gray-500 mb-1">{label}</div>
                    <div className="text-3xl font-bold text-gray-900">{value}</div>
                </div>
                <div className={`p-3 rounded-xl ${colors.bg}`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                </div>
            </div>
        </Card>
    )
}
