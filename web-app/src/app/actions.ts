'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getOrders() {
    return await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    menuItem: true
                }
            }
        }
    })
}

export async function updateOrderStatus(orderId: number, status: string) {
    await prisma.order.update({
        where: { id: orderId },
        data: { status }
    })
    revalidatePath('/admin')
}

export async function getCategories() {
    return await prisma.category.findMany({
        include: { items: true }
    })
}

export async function createMenuItem(data: {
    name: string
    price: number
    categoryId: number
    description?: string
}) {
    await prisma.menuItem.create({
        data: {
            name: data.name,
            price: data.price,
            categoryId: data.categoryId,
            description: data.description,
            isAvailable: true
        }
    })
    revalidatePath('/admin/menu')
}

export async function toggleMenuItemAvailability(id: number, isAvailable: boolean) {
    await prisma.menuItem.update({
        where: { id },
        data: { isAvailable }
    })
    revalidatePath('/admin/menu')
}

export async function placeOrder(tableId: string, items: { menuItemId: number; quantity: number }[]) {
    if (items.length === 0) return

    await prisma.order.create({
        data: {
            tableId,
            status: 'pending',
            items: {
                create: items.map(item => ({
                    menuItemId: item.menuItemId,
                    quantity: item.quantity
                }))
            }
        }
    })
    revalidatePath('/admin')
    revalidatePath(`/order/${tableId}`)
}

export async function updateMenuItem(id: number, data: {
    name: string
    price: number
    categoryId: number
    description?: string
}) {
    await prisma.menuItem.update({
        where: { id },
        data: {
            name: data.name,
            price: data.price,
            categoryId: data.categoryId,
            description: data.description
        }
    })
    revalidatePath('/admin/menu')
}

export async function getMenuItem(id: number) {
    return await prisma.menuItem.findUnique({
        where: { id }
    })
}
