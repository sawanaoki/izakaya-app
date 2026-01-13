export const dynamic = 'force-dynamic'

export default function PingPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Pong!</h1>
            <p>Server is running. (Database Connected & Routing Active)</p>
            <div className="mt-4">
                <a href="/" className="text-blue-500 underline">ホームへ戻る</a>
            </div>
        </div>
    )
}
