import Card from '../Card'

export default function WelcomeCard({ stats }) {
    return (
        <Card
            padding="lg"
            className="bg-gradient-to-r from-peach-500 to-peach-600 text-white shadow-large animate-fade-in"
        >
            <h2 className="text-2xl font-bold mb-2">👋 안녕하세요!</h2>
            <p className="text-peach-100 text-lg">
                {stats.pending > 0
                    ? `오늘 ${stats.pending}명의 기록이 남아있어요`
                    : '모든 작업을 완료했어요! 🎉'}
            </p>
        </Card>
    )
}
