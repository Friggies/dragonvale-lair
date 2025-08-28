import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { dragonsWithImages } from './dragonsWithImages'

const getRandomObjects = (arr, count = 10) => {
    if (count > arr.length) {
        throw new Error('Count cannot be greater than array length')
    }
    const shuffled = [...arr]

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled.slice(0, count)
}

export async function POST(req: Request) {
    try {
        const { action } = await req.json()

        if (action === 'create') {
            // Create 10 pairs (dragon + egg)
            const pairs = getRandomObjects(dragonsWithImages, 10)
                .map((dragon) => [
                    {
                        id: uuidv4(),
                        type: 'dragon',
                        name: dragon,
                        revealed: false,
                        matched: false,
                    },
                    {
                        id: uuidv4(),
                        type: 'egg',
                        name: dragon,
                        revealed: false,
                        matched: false,
                    },
                ])
                .flat()

            // Shuffle deck
            for (let i = pairs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
            }

            return NextResponse.json({ board: pairs })
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
