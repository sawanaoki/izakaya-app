import { getOrders, updateOrderStatus } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BadgeJapaneseYen } from 'lucide-react'

// Helper component to display status cleanly
function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: "bg-yellow-100 text-yellow-800",
        prepared: "bg-blue-100 text-blue-800",
        served: "bg-green-100 text-green-800",
        paid: "bg-gray-100 text-gray-800",
    }
    const labels = {
        pending: "調理待ち",
        prepared: "配膳待ち",
        served: "提供済み",
        paid: "会計済み",
    }
    // @ts-ignore
    const className = `px-2 py-1 rounded text-xs font-semibold ${styles[status] || "bg-gray-100"}`
    // @ts-ignore
    return <span className={className}>{labels[status] || status}</span>
}

export default async function AdminPage() {
    let orders: any[] = []
    let error: string | null = null

    try {
        orders = await getOrders()
    } catch (e: any) {
        console.error('Failed to fetch orders:', e)
        error = e.message || '注文データの取得に失敗しました。'
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">エラーが発生しました</h1>
                <p className="text-muted-foreground mb-4">{error}</p>
                <Link href="/admin">
                    <Button>再試行</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">管理者ダッシュボード</h1>
                <div className="flex gap-2">
                    <Link href="/admin/menu">
                        <Button variant="outline">メニュー管理</Button>
                    </Link>
                    <Link href="/admin/qr">
                        <Button>QRコード発行</Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {orders.length === 0 && (
                    <p className="text-muted-foreground col-span-full text-center py-10">まだ注文はありません。</p>
                )}
                {orders.map((order) => (
                    <Card key={order.id} className={order.status === 'paid' ? 'opacity-60' : ''}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Table {order.tableId}
                            </CardTitle>
                            <StatusBadge status={order.status} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xs text-muted-foreground mb-4">
                                {new Date(order.createdAt).toLocaleTimeString('ja-JP')}
                            </div>
                            <ul className="space-y-2 mb-4">
                                {order.items.map((item: any) => (
                                    <li key={item.id} className="flex justify-between text-sm">
                                        <span>{item.menuItem.name} × {item.quantity}</span>
                                        <span className="font-mono">¥{item.menuItem.price * item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t pt-2 flex justify-between items-center font-bold">
                                <span>合計</span>
                                <span>
                                    ¥{order.items.reduce((sum: number, item: any) => sum + item.menuItem.price * item.quantity, 0)}
                                </span>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <form action={async () => {
                                    'use server'
                                    await updateOrderStatus(order.id, 'served')
                                }}>
                                    {order.status !== 'served' && order.status !== 'paid' && (
                                        <Button size="sm" type="submit" className="w-full">提供済にする</Button>
                                    )}
                                </form>
                                <form action={async () => {
                                    'use server'
                                    await updateOrderStatus(order.id, 'paid')
                                }}>
                                    {order.status === 'served' && (
                                        <Button size="sm" variant="secondary" type="submit" className="w-full">会計済にする</Button>
                                    )}
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
