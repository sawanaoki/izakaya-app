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
            <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center animate-in fade-in zoom-in duration-500">
                <div className="rounded-full bg-green-100 p-6">
                    <UtensilsCrossed className="h-12 w-12 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">注文を受け付けました</h2>
                    <p className="text-muted-foreground">お料理の到着までしばらくお待ちください。</p>
                </div>
                <Button onClick={() => setIsOrderPlaced(false)} className="w-full">
                    追加注文する
                </Button>
            </div>
        )
    }

    if (isCartOpen) {
        return (
            <div className="flex flex-col h-[calc(100vh-80px)]">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">注文内容の確認</h2>
                    <Button variant="ghost" onClick={() => setIsCartOpen(false)}>閉じる</Button>
                </div>

                <div className="flex-1 overflow-auto space-y-4">
                    {cart.length === 0 ? (
                        <p className="text-center text-muted-foreground py-10">カートは空です</p>
                    ) : (
                        cart.map(item => (
                            <Card key={item.menuItemId}>
                                <CardContent className="flex items-center justify-between p-4">
                                    <div>
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">¥{item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="icon" onClick={() => removeFromCart(item.menuItemId)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-4 text-center">{item.quantity}</span>
                                        <Button variant="outline" size="icon" onClick={() => addToCart({ id: item.menuItemId } as any)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="border-t pt-4 mt-auto">
                    <div className="flex justify-between items-center mb-4 text-xl font-bold">
                        <span>合計</span>
                        <span>¥{totalAmount}</span>
                    </div>
                    <Button className="w-full h-12 text-lg" size="lg" disabled={cart.length === 0} onClick={handlePlaceOrder}>
                        注文を確定する
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="pb-20">
            {/* Category Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar sticky top-14 bg-background z-10 py-2">
                {categories.map(cat => (
                    <Button
                        key={cat.id}
                        variant={activeCategory === cat.id ? "default" : "outline"}
                        className="rounded-full whitespace-nowrap"
                        onClick={() => setActiveCategory(cat.id)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-6">
                {categories.filter(c => c.id === activeCategory).map(category => (
                    <div key={category.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="font-bold text-lg hidden">{category.name}</h2>
                        {category.items.map(item => (
                            <Card key={item.id} className={cn("overflow-hidden", !item.isAvailable && "opacity-60")}>
                                <CardContent className="p-4 flex gap-4">
                                    {/* Placeholder for image if needed */}
                                    <div className="flex-1 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold">{item.name}</h3>
                                            <p className="font-semibold">¥{item.price}</p>
                                        </div>
                                        {item.description && (
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        )}

                                        <div className="flex justify-end pt-2">
                                            {item.isAvailable ? (
                                                getItemQuantity(item.id) > 0 ? (
                                                    <div className="flex items-center gap-3">
                                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-4 text-center text-sm font-medium">{getItemQuantity(item.id)}</span>
                                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => addToCart(item)}>
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <Button size="sm" variant="secondary" onClick={() => addToCart(item)}>
                                                        追加
                                                    </Button>
                                                )
                                            ) : (
                                                <span className="text-sm text-destructive font-bold">売り切れ</span>
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
                <div className="fixed bottom-6 left-0 right-0 px-4 z-50 animate-in slide-in-from-bottom duration-300">
                    <Button className="w-full h-14 shadow-lg text-lg rounded-full" onClick={() => setIsCartOpen(true)}>
                        <div className="flex items-center justify-between w-full px-4">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary-foreground text-primary h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                                    {totalItems}
                                </div>
                                <span>注文を確認する</span>
                            </div>
                            <span className="font-bold">¥{totalAmount}</span>
                        </div>
                    </Button>
                </div>
            )}
        </div>
    )
}
