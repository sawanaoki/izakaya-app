import { getCategories, createCategory, deleteCategory } from '@/app/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/menu">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold tracking-tight">カテゴリ管理</h1>
            </div>

            <Card className="pop-card border-4 border-primary/30 rounded-3xl overflow-hidden">
                <CardHeader className="bg-primary/10">
                    <CardTitle className="text-xl font-black text-primary">新規カテゴリ追加</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form action={async (formData) => {
                        'use server'
                        const name = formData.get('name') as string
                        if (name) await createCategory(name)
                    }} className="flex gap-2">
                        <Input name="name" placeholder="カテゴリ名 (例: デザート)" className="rounded-full border-2 border-primary/20 focus:border-primary px-6 font-bold" required />
                        <Button type="submit" className="pop-button rounded-full font-bold shadow-md">
                            <Plus className="h-4 w-4 mr-2" />
                            追加
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Card key={category.id} className="pop-card border-2 border-accent/20 rounded-3xl group transition-all hover:border-accent">
                        <CardContent className="pt-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center font-black text-accent text-xl">
                                    {category.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-black text-xl text-foreground">{category.name}</h3>
                                    <p className="text-sm font-bold text-muted-foreground bg-secondary/70 px-2 py-0.5 rounded-full inline-block">{category.items.length} 項目</p>
                                </div>
                            </div>
                            <form action={async () => {
                                'use server'
                                try {
                                    await deleteCategory(category.id)
                                } catch (e: any) {
                                    console.error(e.message)
                                }
                            }}>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="pop-button rounded-2xl text-destructive hover:text-destructive hover:bg-destructive/10 border-2 border-transparent hover:border-destructive/20 h-10 w-10"
                                    disabled={category.items.length > 0}
                                    title={category.items.length > 0 ? "商品があるカテゴリは削除できません" : "削除"}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
