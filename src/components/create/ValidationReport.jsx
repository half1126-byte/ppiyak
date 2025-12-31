import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function ValidationReport({ report }) {
    if (!report) return null

    const allOK = report.report.every((r) => r.ok)

    return (
        <div
            className={`rounded-xl p-6 mb-6 animate-fade-in ${allOK
                    ? 'bg-mint-50 border-2 border-mint-200'
                    : 'bg-soft-yellow-50 border-2 border-soft-yellow-200'
                }`}
        >
            <div className="flex items-center gap-3 mb-4">
                {allOK ? (
                    <CheckCircle2 className="w-6 h-6 text-mint-600" />
                ) : (
                    <AlertCircle className="w-6 h-6 text-soft-yellow-600" />
                )}
                <div>
                    <h3
                        className={`font-bold ${allOK ? 'text-mint-700' : 'text-soft-yellow-700'
                            }`}
                    >
                        {allOK ? '✓ 검증 통과' : '⚠ 보완 권장'}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {report.report.filter((r) => r.ok).length}/{report.report.length} 항목 충족
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {report.report.map((r, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                        <span
                            className={`font-bold ${r.ok ? 'text-mint-600' : 'text-red-600'
                                }`}
                        >
                            {r.ok ? '✓' : '✗'}
                        </span>
                        <span className="text-gray-700">{r.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
