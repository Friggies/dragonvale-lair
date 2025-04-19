import dragons from '@/data/dragons.json'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Dragon from '@/types/dragon'
import breedDragon from '@/utils/fakeBreeding'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

const allDragons = dragons.filter(
    (dragon) =>
        dragon.rarity.includes('Primary') || dragon.rarity.includes('Hybrid')
)

// ---- Interfaces (matching front-end definitions) ----

interface Egg {
    name: string
    level: number
    basePoints: number
    twin?: boolean
}

interface Cell {
    egg: Egg | null
    createsTwin?: boolean
    extraPoints?: boolean
}

interface Bank {
    goals: object[]
    eggs: Egg[]
}

type Board = Cell[][]

function createDefaultBoard(): Board {
    const boardSize = 4
    const randomEgg = (): Egg => {
        const elementDragons = allDragons.filter((dragon) =>
            dragon.elements.includes('Fire')
        )
        const dragon: Dragon =
            elementDragons[Math.floor(Math.random() * elementDragons.length)]
        return {
            name: dragon.name,
            level: 1,
            basePoints: dragon.income![0],
        }
    }

    return Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ({
            egg: randomEgg(),
        }))
    )
}

// ---- Modified Fake Breeding Function ----
function fakeBreedingMerge(
    egg1: Egg,
    egg2: Egg,
    twinTriggered: boolean,
    extraTriggered: boolean
): Egg & { points: number } {
    const newEgg = breedDragon(egg1.name, egg2.name)
    const bonus = egg1.name === egg2.name ? 1 : 0
    const newLevel = egg1.level + egg2.level + bonus
    const newBasePoints = Math.floor(Math.random() * 101) // 0 to 100
    let points = newBasePoints * newLevel
    if (extraTriggered) {
        points += newBasePoints * 1.5
    }
    if (twinTriggered) {
        points *= 2
    }
    return {
        name: newEgg!.name,
        level: newLevel,
        basePoints: newBasePoints,
        twin: twinTriggered,
        points,
    }
}

// ---- Main API Endpoint ----
export async function POST(request: Request) {
    const { action, friendId, gameId, source, target } = await request.json()

    if (action === 'create') {
        // Always create a new game when the user presses PLAY.
        const defaultBoard = createDefaultBoard()
        const { data: newGame, error: createError } = await supabase
            .from('eggy_hatchy_games')
            .insert({
                friend_id: friendId,
                board: defaultBoard,
                bank: {
                    goals: [],
                    eggs: [],
                },
            })
            .select()
            .single()

        if (createError || !newGame) {
            return NextResponse.json(
                { error: createError?.message || 'Failed to create game' },
                { status: 500 }
            )
        }
        return NextResponse.json(newGame)
    } else if (action === 'merge') {
        // For merge and bank actions, we assume gameId is provided.
        const { data: game, error: fetchError } = await supabase
            .from('eggy_hatchy_games')
            .select('*')
            .eq('id', gameId)
            .single()

        if (fetchError || !game) {
            return NextResponse.json(
                { error: 'Game not found' },
                { status: 404 }
            )
        }

        let board: Board = game.board

        // Merge Action
        const { row: sRow, col: sCol } = source
        const { row: tRow, col: tCol } = target

        if (!board[sRow][sCol].egg || !board[tRow][tCol].egg) {
            return NextResponse.json(
                { error: 'Source or target cell has no egg' },
                { status: 400 }
            )
        }

        if (sRow !== tRow && sCol !== tCol) {
            return NextResponse.json(
                { error: 'Eggs must be in the same row or column' },
                { status: 400 }
            )
        }

        // Build merge path (inclusive)
        let mergeCells: { row: number; col: number }[] = []
        if (sRow === tRow) {
            const minCol = Math.min(sCol, tCol)
            const maxCol = Math.max(sCol, tCol)
            for (let col = minCol; col <= maxCol; col++) {
                mergeCells.push({ row: sRow, col })
            }
        } else {
            const minRow = Math.min(sRow, tRow)
            const maxRow = Math.max(sRow, tRow)
            for (let row = minRow; row <= maxRow; row++) {
                mergeCells.push({ row, col: sCol })
            }
        }

        // Validate intermediate cells (excluding endpoints) are empty.
        for (let i = 1; i < mergeCells.length - 1; i++) {
            const { row, col } = mergeCells[i]
            if (board[row][col].egg) {
                return NextResponse.json(
                    { error: 'Merge illegal: an intermediate cell has an egg' },
                    { status: 400 }
                )
            }
        }

        // Check trigger flags in merge path.
        let twinTriggered = false,
            extraTriggered = false
        mergeCells.forEach(({ row, col }) => {
            const cell = board[row][col]
            if (cell.createsTwin) twinTriggered = true
            if (cell.extraPoints) extraTriggered = true
        })

        const egg1 = board[sRow][sCol].egg!
        const egg2 = board[tRow][tCol].egg!
        const newEgg = fakeBreedingMerge(
            egg1,
            egg2,
            twinTriggered,
            extraTriggered
        )

        // Remove eggs along merge path.
        mergeCells.forEach(({ row, col }) => {
            board[row][col].egg = null
        })
        // Place new egg in target cell.
        board[tRow][tCol].egg = newEgg

        const { error: updateError } = await supabase
            .from('eggy_hatchy_games')
            .update({ board })
            .eq('id', gameId)

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update game state' },
                { status: 500 }
            )
        }
        return NextResponse.json({ board, newEgg })
    } else if (action === 'bank') {
        // Banking action: remove egg from a cell and add it to the bank.
        const { data: game, error: fetchError } = await supabase
            .from('eggy_hatchy_games')
            .select('*')
            .eq('id', gameId)
            .single()

        if (fetchError || !game) {
            return NextResponse.json(
                { error: 'Game not found' },
                { status: 404 }
            )
        }

        let board: Board = game.board
        let bank: Bank = game.bank || []
        const { row, col } = source

        if (!board[row][col].egg) {
            return NextResponse.json(
                { error: 'No egg to bank in the specified cell' },
                { status: 400 }
            )
        }

        const eggToBank = board[row][col].egg
        board[row][col].egg = null
        bank.eggs.push(eggToBank)

        const { error: updateError } = await supabase
            .from('eggy_hatchy_games')
            .update({ board, bank })
            .eq('id', gameId)

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update game state' },
                { status: 500 }
            )
        }
        return NextResponse.json({ board, bank })
    } else {
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
}
