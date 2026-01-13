import { getCategories } from '@/app/actions'
import OrderInterface from './OrderInterface'
import { notFound } from 'next/navigation'

export default async function OrderPage({ params }: { params: Promise<{ tableId: string }> }) {
    const { tableId } = await params
    if (!tableId) return notFound()

    const categories = await getCategories()

    return (
        <div className="pb-8">
            <div className="mb-4">
                <p className="text-sm text-muted-foreground">Table: <span className="font-bold text-foreground">{tableId}</span></p>
                <h1 className="text-2xl font-bold">メニュー</h1>
            </div>

            <OrderInterface tableId={tableId} categories={categories} />
        </div>
    )
}
