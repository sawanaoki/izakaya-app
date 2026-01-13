import { getOrders, updateOrderStatus, deleteOrder } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { BadgeJapaneseYen } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Helper component to display status cleanly
function StatusBadge({ status }: { status: string }) {
    const styles = {
        pending: "bg-amber-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
        prepared: "bg-blue-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
        served: "bg-emerald-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
        paid: "bg-slate-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)]",
    }
    const labels = {
        pending: "調理中🔥",
        prepared: "配膳待機✨",
        served: "提供済✅",
        paid: "会計済💰",
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
                <div className="flex items-center gap-2">
                    <BadgeJapaneseYen className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">管理者ダッシュボード</h1>
                </div>
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
                {orders.map((order: any) => (
                    <Card key={order.id} className={`pop-card border-2 ${order.status === 'paid' ? 'opacity-60 border-gray-200' : 'border-primary/20'} rounded-3xl overflow-hidden`}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-secondary/20">
                            <CardTitle className="text-lg font-black text-primary">
                                Table {order.tableId}
                            </CardTitle>
                            <StatusBadge status={order.status} />
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="text-xs font-bold text-muted-foreground mb-4 bg-white/50 px-2 py-1 rounded-full inline-block">
                                {new Date(order.createdAt).toLocaleTimeString('ja-JP')}
                            </div>
                            <ul className="space-y-2 mb-4">
                                {order.items.map((item: any) => (
                                    <li key={item.id} className="flex justify-between text-sm font-medium">
                                        <span>{item.menuItem.name} × {item.quantity}</span>
                                        <span className="font-black text-accent">¥{item.menuItem.price * item.quantity}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t-2 border-dashed pt-2 flex justify-between items-center font-black text-lg">
                                <span>合計</span>
                                <span className="text-primary underline decoration-accent decoration-4">
                                    ¥{order.items.reduce((sum: number, item: any) => sum + item.menuItem.price * item.quantity, 0)}
                                </span>
                            </div>

                            <div className="mt-6 flex flex-col gap-2">
                                <form action={async () => {
                                    'use server'
                                    await updateOrderStatus(order.id, 'served')
                                }} className="flex-1">
                                    {order.status !== 'served' && order.status !== 'paid' && (
                                        <Button size="sm" type="submit" className="w-full pop-button rounded-full font-bold shadow-sm">提供済にする</Button>
                                    )}
                                </form>
                                <form action={async () => {
                                    'use server'
                                    await updateOrderStatus(order.id, 'paid')
                                }} className="flex-1">
                                    {order.status === 'served' && (
                                        <Button size="sm" variant="secondary" type="submit" className="w-full pop-button rounded-full font-bold shadow-sm bg-accent text-white hover:bg-accent/80">会計済にする</Button>
                                    )}
                                </form>
                                <form action={async () => {
                                    'use server'
                                    await deleteOrder(order.id)
                                }} className="w-full">
                                    {order.status === 'paid' && (
                                        <Button size="sm" variant="destructive" type="submit" className="w-full pop-button rounded-full font-bold shadow-sm">削除する</Button>
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
