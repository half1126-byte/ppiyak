import { Zap } from 'lucide-react'
import Card from '../Card'
import Button from '../Button'
import Badge from '../Badge'

export default function AISuggestionCard({
    suggestion,
    index,
    onSelect,
    onCopy,
}) {
    const gradients = [
        'from-peach-500 to-peach-600',
        'from-lavender-500 to-lavender-600',
        'from-mint-500 to-mint-600',
    ]

    return (
        <Card className="animate-fade-in" hover>
            <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                    <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white bg-gradient-to-br ${gradients[index % 3]
                            } shadow-soft`}
                    >
                        {index + 1}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                        <Badge variant="default">{suggestion.type}</Badge>
                        {index === 0 && (
                            <Badge variant="info" className="flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                추천
                            </Badge>
                        )}
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        {suggestion.text}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onSelect(suggestion.text)}
                        >
                            이 문장 사용하기
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onCopy(suggestion.text)}
                        >
                            복사
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    )
}
