import Link from 'next/link'
import { Beer } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <Beer className="h-6 w-6" />
                    <span className="hidden font-bold sm:inline-block">
                        居酒屋 モバイルオーダー
                    </span>
                    <span className="font-bold sm:hidden">
                        Izakaya
                    </span>
                </Link>
                <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
                    <Link
                        href="/admin"
                        className="transition-colors hover:text-foreground/80 text-foreground/60"
                    >
                        管理画面
                    </Link>
                </nav>
            </div>
        </header>
    )
}
