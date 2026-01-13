import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function PingPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Pong!</h1>
            <p>Server is running. (Database Connected & Routing Active)</p>
            <div className="mt-4">
                <Link href="/" className="text-blue-500 underline">ホームへ戻る</Link>
            </div>
        </div>
    )
}
