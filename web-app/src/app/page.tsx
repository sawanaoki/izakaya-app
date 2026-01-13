import prisma from '@/lib/prisma'

export default async function Home() {
  const categories = await prisma.category.findMany({
    include: { items: true },
  })

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">モバイルオーダー 動作確認</h1>
      <div className="space-y-6">
        {categories.map((category) => (
          <div key={category.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{category.name}</h2>
            <ul className="space-y-2">
              {category.items.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>¥{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  )
}
