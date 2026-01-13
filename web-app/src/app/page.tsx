import prisma from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { items: true },
  })

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">居酒屋メニュー</h1>
      <div className="space-y-6">
        {categories.map((category: any) => (
          <div key={category.id} className="pop-card border-2 border-primary/20 p-6 rounded-3xl bg-white space-y-4">
            <h2 className="text-2xl font-black text-primary mb-4 flex items-center gap-2">
              <span className="w-2 h-8 bg-accent rounded-full inline-block"></span>
              {category.name}
            </h2>
            <ul className="space-y-3">
              {category.items.map((item: any) => (
                <li key={item.id} className="flex justify-between items-center bg-secondary/30 p-3 rounded-2xl group hover:bg-secondary/50 transition-colors">
                  <span className="font-bold">{item.name}</span>
                  <span className="font-black text-accent bg-white px-3 py-1 rounded-full shadow-sm">¥{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        管理者の方は <Link href="/admin" className="underline">こちら</Link>
      </div>
    </main>
  )
}
