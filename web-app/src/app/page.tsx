export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">居酒屋モバイルオーダー - 疎通確認中</h1>
      <p>このページが表示されていれば、Next.jsのデプロイ自体は成功しています。</p>
      <div className="mt-4 flex gap-4">
        <a href="/ping" className="text-blue-500 underline">Pingテスト</a>
        <a href="/admin" className="text-blue-500 underline">管理画面</a>
      </div>
    </main>
  )
}
