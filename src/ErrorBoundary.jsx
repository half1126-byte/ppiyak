import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50 p-6 font-sans">
                    <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-red-100">
                        <h1 className="text-3xl font-bold text-red-600 mb-4">앗! 오류가 발생했어요 😢</h1>
                        <p className="text-gray-600 mb-6">죄송합니다. 애플리케이션을 실행하는 도중 문제가 생겼습니다.</p>

                        <div className="bg-slate-900 rounded-lg p-4 overflow-auto max-h-96">
                            <h3 className="text-red-400 font-mono text-sm mb-2">Error Message:</h3>
                            <pre className="text-white font-mono text-sm whitespace-pre-wrap">
                                {this.state.error && this.state.error.toString()}
                            </pre>

                            {this.state.errorInfo && (
                                <>
                                    <h3 className="text-slate-400 font-mono text-sm mt-4 mb-2">Stack Trace:</h3>
                                    <pre className="text-slate-300 font-mono text-xs whitespace-pre-wrap">
                                        {this.state.errorInfo.componentStack}
                                    </pre>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-colors w-full"
                        >
                            페이지 새로고침
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
