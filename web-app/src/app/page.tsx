import prisma from '@/lib/prisma'

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
          <div key={category.id} className="border p-4 rounded shadow bg-white">
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <ul className="space-y-2">
              {category.items.map((item: any) => (
                <li key={item.id} className="flex justify-between border-b pb-1">
                  <span>{item.name}</span>
                  <span className="font-mono">¥{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center text-sm text-muted-foreground">
        管理者の方は <a href="/admin" className="underline">こちら</a>
      </div>
    </main>
  )
}
