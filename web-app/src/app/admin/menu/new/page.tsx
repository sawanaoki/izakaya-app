import { createMenuItem, getCategories } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function NewMenuItemPage() {
    const categories = await getCategories()

    async function action(formData: FormData) {
        'use server'
        const name = formData.get('name') as string
        const price = Number(formData.get('price'))
        const categoryId = Number(formData.get('categoryId'))
        const description = formData.get('description') as string

        await createMenuItem({
            name,
            price,
            categoryId,
            description
        })

        redirect('/admin/menu')
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/menu">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">新規商品追加</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>商品情報を入力</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">商品名</Label>
                            <Input id="name" name="name" required placeholder="例: 枝豆" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">価格（円）</Label>
                            <Input id="price" name="price" type="number" required placeholder="300" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">カテゴリ</Label>
                            <div className="relative">
                                <select
                                    id="categoryId"
                                    name="categoryId"
                                    className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
                                    required
                                >
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                {/* Custom arrow could go here */}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">説明（任意）</Label>
                            <Input id="description" name="description" placeholder="商品の説明を入力" />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/admin/menu">
                                <Button variant="outline" type="button">キャンセル</Button>
                            </Link>
                            <Button type="submit">登録する</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
