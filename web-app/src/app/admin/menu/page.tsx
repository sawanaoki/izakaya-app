import { getCategories, toggleMenuItemAvailability } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch' // Need to create Switch component or just use button for now
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export default async function MenuPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">メニュー管理</h1>
                    <p className="text-muted-foreground">
                        提供するメニューの編集・在庫管理を行います
                    </p>
                </div>
                <Link href="/admin/menu/new">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        新規商品追加
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6">
                {categories.map((category) => (
                    <Card key={category.id}>
                        <CardHeader>
                            <CardTitle>{category.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {category.items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="font-medium leading-none">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">¥{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <form action={async () => {
                                                'use server'
                                                await toggleMenuItemAvailability(item.id, !item.isAvailable)
                                            }}>
                                                <Button
                                                    type="submit"
                                                    variant={item.isAvailable ? "outline" : "secondary"}
                                                    size="sm"
                                                    className={!item.isAvailable ? "opacity-50" : ""}
                                                >
                                                    {item.isAvailable ? "販売中" : "売切"}
                                                </Button>
                                            </form>
                                            <Link href={`/admin/menu/${item.id}/edit`}>
                                                <Button variant="ghost" size="sm">編集</Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
