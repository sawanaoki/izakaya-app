'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ShoppingCart, Minus, Plus, UtensilsCrossed } from 'lucide-react'
import { placeOrder } from '@/app/actions'
import { cn } from '@/lib/utils'

type CategoryWithItems = {
    id: number
    name: string
    items: {
        id: number
        name: string
        price: number
        description: string | null
        isAvailable: boolean
        imageUrl: string | null
    }[]
}

type CartItem = {
    menuItemId: number
    name: string
    price: number
    quantity: number
}

export default function OrderInterface({
    tableId,
    categories
}: {
    tableId: string
    categories: CategoryWithItems[]
}) {
    const [cart, setCart] = useState<CartItem[]>([])
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id || 0)
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isOrderPlaced, setIsOrderPlaced] = useState(false)

    const addToCart = (item: CategoryWithItems['items'][0]) => {
        setCart(prev => {
            const existing = prev.find(i => i.menuItemId === item.id)
            if (existing) {
                return prev.map(i => i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i)
            }
            return [...prev, { menuItemId: item.id, name: item.name, price: item.price, quantity: 1 }]
        })
    }

    const removeFromCart = (menuItemId: number) => {
        setCart(prev => {
            const existing = prev.find(i => i.menuItemId === menuItemId)
            if (existing && existing.quantity > 1) {
                return prev.map(i => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i)
            }
            return prev.filter(i => i.menuItemId !== menuItemId)
        })
    }

    const getItemQuantity = (menuItemId: number) => {
        return cart.find(i => i.menuItemId === menuItemId)?.quantity || 0
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return
        await placeOrder(tableId, cart.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })))
        setCart([])
        setIsOrderPlaced(true)
        setIsCartOpen(false)
    }

    if (isOrderPlaced) {
        return (
            <div className="flex flex-col items-center justify-center p-8 space-y-8 text-center animate-in fade-in zoom-in duration-700 bg-white/50 rounded-[3rem] border-4 border-dashed border-primary/20 mt-12">
                <div className="rounded-full bg-accent p-8 rotate-12 shadow-lg">
                    <UtensilsCrossed className="h-16 w-16 text-white" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-4xl font-black text-primary italic">THANK YOU!</h2>
                    <h3 className="text-2xl font-black">注文を受け付けました✨</h3>
                    <p className="text-lg font-bold text-muted-foreground">お料理の到着までしばらくお待ちください！</p>
                </div>
                <Button onClick={() => setIsOrderPlaced(false)} className="w-full pop-button h-16 text-xl rounded-full font-black shadow-xl">
                    もっと注文する！😋
                </Button>
            </div>
        )
    }

    if (isCartOpen) {
        return (
            <div className="flex flex-col h-[calc(100vh-100px)] animate-in slide-in-from-right duration-500">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black text-primary underline decoration-accent decoration-8 underline-offset-4">注文カート 🛒</h2>
                    <Button variant="ghost" onClick={() => setIsCartOpen(false)} className="pop-button font-black hover:bg-accent/10">閉じる</Button>
                </div>

                <div className="flex-1 overflow-auto space-y-6 px-1">
                    {cart.length === 0 ? (
                        <div className="text-center py-20 space-y-4">
                            <p className="text-6xl italic opacity-20 font-black">EMPTY</p>
                            <p className="text-xl font-bold text-muted-foreground">カートはまだ空っぽです</p>
                        </div>
                    ) : (
                        cart.map(item => (
                            <Card key={item.menuItemId} className="pop-card border-2 border-primary/20 rounded-3xl group">
                                <CardContent className="flex items-center justify-between p-5">
                                    <div className="space-y-1">
                                        <p className="text-xl font-black">{item.name}</p>
                                        <p className="text-lg font-black text-accent bg-secondary/50 px-3 py-0.5 rounded-full inline-block">¥{item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-4 bg-secondary/30 p-2 rounded-2xl">
                                        <Button variant="outline" size="icon" onClick={() => removeFromCart(item.menuItemId)} className="pop-button h-10 w-10 border-2 rounded-xl bg-white">
                                            <Minus className="h-5 w-5 font-black" />
                                        </Button>
                                        <span className="w-6 text-center text-xl font-black">{item.quantity}</span>
                                        <Button variant="outline" size="icon" onClick={() => addToCart({ id: item.menuItemId } as any)} className="pop-button h-10 w-10 border-2 rounded-xl bg-white">
                                            <Plus className="h-5 w-5 font-black" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="bg-white p-6 rounded-[2.5rem] pop-card border-4 border-primary mt-8">
                    <div className="flex justify-between items-center mb-6 text-2xl font-black px-2">
                        <span>合計金額</span>
                        <span className="text-3xl text-primary underline decoration-accent decoration-4">¥{totalAmount}</span>
                    </div>
                    <Button className="w-full h-18 text-2xl rounded-full font-black shadow-lg pop-button" size="lg" disabled={cart.length === 0} onClick={handlePlaceOrder}>
                        注文を確定する！🔥
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-24">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-3 pb-6 no-scrollbar sticky top-14 bg-background z-10 py-4 -mx-2 px-2">
                {categories.map(cat => (
                    <Button
                        key={cat.id}
                        variant={activeCategory === cat.id ? "default" : "outline"}
                        className={cn(
                            "pop-button rounded-full whitespace-nowrap h-12 px-8 font-black text-lg transition-all",
                            activeCategory === cat.id
                                ? "shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] scale-110"
                                : "hover:bg-accent/10 hover:border-accent hover:text-accent border-2"
                        )}
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-8 mt-4">
                {categories.filter(c => c.id === activeCategory).map(category => (
                    <div key={category.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        {category.items.map(item => (
                            <Card key={item.id} className={cn(
                                "pop-card border-2 rounded-[2rem] overflow-hidden group transition-all",
                                item.isAvailable ? "border-primary/10 bg-white" : "opacity-60 bg-slate-50 border-gray-200"
                            )}>
                                <CardContent className="p-0 flex gap-0 h-40">
                                    <div className="w-1/3 bg-secondary/20 flex items-center justify-center p-4">
                                        <UtensilsCrossed className="h-12 w-12 text-primary/30 rotate-12" />
                                    </div>
                                    <div className="flex-1 p-6 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-xl font-black">{item.name}</h3>
                                                <p className="text-xl font-black text-accent">¥{item.price}</p>
                                            </div>
                                            {item.description && (
                                                <p className="text-sm font-bold text-muted-foreground line-clamp-2">{item.description}</p>
                                            )}
                                        </div>

                                        <div className="flex justify-end items-end">
                                            {item.isAvailable ? (
                                                getItemQuantity(item.id) > 0 ? (
                                                    <div className="flex items-center gap-4 bg-secondary/30 p-2 rounded-2xl shadow-inner">
                                                        <Button variant="outline" size="icon" className="h-10 w-10 pop-button rounded-xl border-2 bg-white" onClick={() => removeFromCart(item.id)}>
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className="w-4 text-center text-xl font-black">{getItemQuantity(item.id)}</span>
                                                        <Button variant="outline" size="icon" className="h-10 w-10 pop-button rounded-xl border-2 bg-white" onClick={() => addToCart(item)}>
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button size="lg" className="pop-button h-12 w-32 rounded-full font-black text-lg shadow-md" onClick={() => addToCart(item)}>
                                                        注文する!
                                                    </Button>
                                                )
                                            ) : (
                                                <span className="text-lg text-destructive font-black italic bg-destructive/10 px-4 py-1 rounded-full border-2 border-destructive/20 select-none">SOLD OUT</span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>

            {/* Floating Cart Button */}
            {totalItems > 0 && (
                <div className="fixed bottom-8 left-0 right-0 px-6 z-50 animate-in slide-in-from-bottom-8 duration-500">
                    <Button className="w-full h-16 shadow-[0px_8px_24px_rgba(249,115,22,0.4)] text-2xl rounded-full font-black pop-button border-4 border-white" onClick={() => setIsCartOpen(true)}>
                        <div className="flex items-center justify-between w-full px-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-white text-primary h-10 w-10 rounded-full flex items-center justify-center text-xl font-black shadow-sm scale-110">
                                    {totalItems}
                                </div>
                                <span>注文を確認🔥</span>
                            </div>
                            <span className="text-2xl italic">¥{totalAmount}</span>
                        </div>
                    </Button>
                </div>
            )}
        </div>
    )
}
