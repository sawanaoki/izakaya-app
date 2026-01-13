import Link from 'next/link'
import { Beer } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full bg-primary shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)] mb-4">
            <div className="container flex h-16 items-center px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2 text-white">
                    <Beer className="h-8 w-8 rotate-12" />
                    <span className="hidden font-black text-xl sm:inline-block italic tracking-tighter">
                        IZAKAYA ORDER
                    </span>
                    <span className="font-black text-xl sm:hidden italic tracking-tighter">
                        ORDER
                    </span>
                </Link>
                <nav className="flex flex-1 items-center justify-end space-x-4 text-sm font-black text-white">
                    <Link
                        href="/admin"
                        className="pop-button bg-white text-primary px-4 py-1.5 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-all"
                    >
                        管理者 🛠️
                    </Link>
                </nav>
            </div>
        </header>
    )
}
