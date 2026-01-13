import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function AdminPage() {
    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">管理者ダッシュボード - 診断中</h1>
            <p>管理者画面ルートの疎通を確認しています。</p>
            <div className="mt-4">
                <Link href="/admin/menu" className="bg-blue-500 text-white px-4 py-2 rounded inline-block">
                    メニュー管理へ
                </Link>
            </div>
            <div className="mt-2 text-sm text-gray-500">
                もしこのページが見えていれば、Vercelのデプロイとルーティングは正常です。
            </div>
        </div>
    )
}
