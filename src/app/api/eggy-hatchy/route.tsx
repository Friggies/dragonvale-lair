import dragons from '@/data/dragons.json'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Dragon from '@/types/dragon'
import breedDragon from '@/utils/fakeBreeding'
import regularElements from '@/data/regularElements'

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
    points: number
    elements: string[]
    twin?: boolean
}

interface Goal {
    element: string
    level: number
    amount: number
}

interface Cell {
    egg: Egg | null
    createsTwin?: boolean
    extraPoints?: boolean
}

interface Bank {
    goals: Goal[]
    eggs: Egg[]
}

type Board = Cell[][]

function createDefaultBoard(
    gameElementOne: string,
    gameElementTwo: string
): Board {
    const boardSize = 4
    const randomEgg = (): Egg => {
        const elementDragonsOne = allDragons.filter((dragon) =>
            dragon.elements.includes(gameElementOne)
        )
        const elementDragonsTwo = allDragons.filter((dragon) =>
            dragon.elements.includes(gameElementTwo)
        )

        const fromElementList = Math.random() < 0.8 // 80%

        const fromOne = Math.random() < 0.5 // 50%

        const dragonList = fromElementList
            ? fromOne
                ? elementDragonsOne
                : elementDragonsTwo
            : allDragons

        const dragon: Dragon =
            dragonList[Math.floor(Math.random() * dragonList.length)]

        let points = dragon.income![0]
        let { rarity } = dragon
        if (rarity === 'Hybrid') {
            points *= 5
        } else if (rarity === 'Rare') {
            points *= 20
        } else if (
            rarity === 'Gemstone' ||
            rarity === 'Galaxy' ||
            rarity === 'Epic'
        ) {
            points *= 60
        }

        points = Math.floor(points)

        return {
            name: dragon.name,
            level: 1,
            elements: dragon.elements,
            points,
            twin: false,
        }
    }

    return Array.from({ length: boardSize }, () =>
        Array.from({ length: boardSize }, () => ({
            egg: randomEgg(),
        }))
    )
}

function createDefaultGoals(gameElementOne: string, gameElementTwo: string) {
    return [
        {
            element: gameElementOne,
            level: 3,
            amount: 3,
        },
        {
            element: gameElementTwo,
            level: 3,
            amount: 1,
        },
    ]
}

// ---- Modified Fake Breeding Function ----
function fakeBreedingMerge(
    egg1: Egg,
    egg2: Egg,
    twinTriggered: boolean,
    extraTriggered: boolean
): Egg & { points: number } {
    const newEgg = breedDragon(egg1.name, egg2.name)!

    let isTwin = twinTriggered || egg1.twin || egg2.twin

    const bonus = egg1.name === egg2.name ? 1 : 0

    const newLevel =
        (extraTriggered
            ? (egg1.level + egg2.level) * 2
            : egg1.level + egg2.level) + bonus

    let points = newEgg.income![0]

    let { rarity } = newEgg
    if (rarity === 'Hybrid') {
        points *= 5
    } else if (rarity === 'Rare') {
        points *= 20
    } else if (
        rarity === 'Gemstone' ||
        rarity === 'Galaxy' ||
        rarity === 'Epic'
    ) {
        points *= 60
    }

    points = points * Math.pow(1.2, newLevel - 1)
    if (isTwin) points = points * 2
    points = Math.floor(points)

    return {
        name: newEgg!.name,
        level: newLevel,
        points,
        elements: newEgg!.elements,
        twin: isTwin,
    }
}

// ---- Main API Endpoint ----
export async function POST(request: Request) {
    const { action, friendID, gameId, source, target } = await request.json()

    if (action === 'create') {
        const gameElementOne =
            regularElements[Math.floor(Math.random() * regularElements.length)]
        const gameElementTwo = regularElements.filter(
            (e) => e !== gameElementOne
        )[Math.floor(Math.random() * (regularElements.length - 1))]

        const { data: newGame, error: createError } = await supabase
            .from('eggy_hatchy_games')
            .insert({
                friend_id: friendID,
                board: createDefaultBoard(gameElementOne, gameElementTwo),
                bank: {
                    goals: createDefaultGoals(gameElementOne, gameElementTwo),
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

        // If twin was triggered, clear it from every merge cell that had it
        if (twinTriggered) {
            mergeCells.forEach(({ row, col }) => {
                if (board[row][col].createsTwin) {
                    delete board[row][col].createsTwin
                }
            })
        }

        // If extraPoints was triggered, clear it from every merge cell that had it
        if (extraTriggered) {
            mergeCells.forEach(({ row, col }) => {
                if (board[row][col].extraPoints) {
                    delete board[row][col].extraPoints
                }
            })
        }

        // Remove eggs along merge path.
        mergeCells.forEach(({ row, col }) => {
            board[row][col].egg = null
        })
        // Place new egg in target cell.
        board[tRow][tCol].egg = newEgg

        // Pick one of the mergeCells at random, 10% chance to add a trigger:
        if (Math.random() < 0.1) {
            // Choose a random cell from the path
            const chosen =
                mergeCells[Math.floor(Math.random() * mergeCells.length)]
            // Decide whether it’s a twin trigger or an extra-points trigger
            if (Math.random() < 0.5) {
                board[chosen.row][chosen.col].createsTwin = true
            } else {
                board[chosen.row][chosen.col].extraPoints = true
            }
        }

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

        const gameOver = board.every((rowCells) =>
            rowCells.every((cell) => cell.egg === null)
        )

        let gameScore: number | null = null

        if (gameOver) {
            const goalsMet = bank.goals.every((goal) => {
                const matchedCount = bank.eggs.filter(
                    (egg) =>
                        egg.level >= goal.level &&
                        egg.elements.includes(goal.element)
                ).length
                return matchedCount >= goal.amount
            })

            const gamePoints = bank.eggs.reduce(
                (sum, egg) => sum + egg.points,
                0
            )
            const pointGoalMet = gamePoints >= 2000

            if (goalsMet && pointGoalMet) {
                console.log(friendID)
                if (!friendID) {
                    gameScore = gamePoints
                    console.log('No FriendID')
                } else {
                    const { count, error } = await supabase
                        .from('eggy_hatchy_games')
                        .select('*', { count: 'exact', head: true })
                        .eq('friend_id', friendID)
                        .not('score', 'is', null)

                    if (error) {
                        return NextResponse.json(
                            { error: 'Failed to add game score.' },
                            { status: 500 }
                        )
                    }
                    gameScore = Math.round(
                        gamePoints * (1 + (count! + 1) / 100)
                    )
                    console.log(gameScore)
                }
            }
        }

        const updates: Record<string, any> = { board, bank }
        if (gameScore) {
            updates.score = gameScore
        }

        console.log(updates)

        const { error: updateError } = await supabase
            .from('eggy_hatchy_games')
            .update(updates)
            .eq('id', gameId)

        if (updateError) {
            return NextResponse.json(
                { error: 'Failed to update game state' },
                { status: 500 }
            )
        }
        return NextResponse.json({ board, bank, gameScore })
    } else {
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
}
