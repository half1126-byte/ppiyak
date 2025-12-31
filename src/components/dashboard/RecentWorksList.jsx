import { Copy } from 'lucide-react'
import Card from '../Card'
import Badge from '../Badge'

export default function RecentWorksList({ works, onCopy }) {
    if (!works || works.length === 0) {
        return null
    }

    return (
        <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4">최근 작업</h3>
            <Card padding="sm">
                <div className="divide-y divide-gray-100">
                    {works.slice(0, 5).map((work) => (
                        <div
                            key={work.id}
                            className="p-4 hover:bg-peach-50 transition-smooth rounded-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-900">
                                            {work.studentName}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            ({work.age})
                                        </span>
                                        {work.validated && (
                                            <Badge variant="success" size="sm">
                                                검증완료
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {new Date(work.createdAt).toLocaleDateString('ko-KR')}{' '}
                                        {new Date(work.createdAt).toLocaleTimeString('ko-KR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onCopy(work.text)}
                                    className="p-2 hover:bg-peach-100 rounded-lg transition-smooth min-w-touch min-h-touch flex items-center justify-center"
                                    aria-label="복사"
                                >
                                    <Copy className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
