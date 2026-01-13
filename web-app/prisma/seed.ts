import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Clean up existing data
    try {
        await prisma.orderItem.deleteMany()
        await prisma.order.deleteMany()
        await prisma.menuItem.deleteMany()
        await prisma.category.deleteMany()

        const drinks = await prisma.category.create({
            data: {
                name: 'ドリンク',
                items: {
                    create: [
                        { name: '生ビール', price: 500, description: 'まずはこれ！' },
                        { name: 'ハイボール', price: 450 },
                        { name: 'ウーロン茶', price: 300 },
                    ],
                },
            },
        })

        const food = await prisma.category.create({
            data: {
                name: 'おつまみ',
                items: {
                    create: [
                        { name: '枝豆', price: 300 },
                        { name: '唐揚げ', price: 600, description: 'ジューシーな唐揚げ' },
                        { name: 'ポテトフライ', price: 400 },
                    ],
                },
            },
        })

        console.log('Seeding finished.')
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
