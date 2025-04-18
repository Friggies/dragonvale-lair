'use client'
import transformToEggName from '@/utils/transformToEggName'
import React, { useState } from 'react'

// ---- Types and Fake Breeding Logic ----

export interface Egg {
    name: string
    level: number
    basePoints: number
    twin?: boolean
}

export interface Goal {
    points: number
    eggs?: {
        element: string
        level: number
        amount: number
    }[]
}

export interface Cell {
    egg: Egg | null
    createsTwin?: boolean
    extraPoints?: boolean
}

export type Board = Cell[][]

interface Bank {
    goals: Goal[]
    eggs: Egg[]
}

export function fakeBreedingMerge(
    egg1: Egg,
    egg2: Egg,
    twinTriggered: boolean,
    extraTriggered: boolean
): Egg {
    const bonus = egg1.name === egg2.name ? 1 : 0
    const newLevel = egg1.level + egg2.level + bonus
    const newBasePoints = Math.floor(Math.random() * 101)
    let points = newBasePoints * newLevel
    if (extraTriggered) points += newBasePoints * 1.5
    if (twinTriggered) points *= 2
    return {
        name: `${egg1.name}-${egg2.name}`,
        level: newLevel,
        basePoints: newBasePoints,
        twin: twinTriggered,
    }
}

// ---- Main Game Component ----

const Tool: React.FC = () => {
    const [friendId, setFriendId] = useState('')
    const [gameId, setGameId] = useState<string | null>(null)
    const [board, setBoard] = useState<Board | null>(null)
    const [bank, setBank] = useState<Bank | null>(null)
    const [selected, setSelected] = useState<{
        row: number
        col: number
    } | null>(null)
    const [previewRange, setPreviewRange] = useState<{
        min: number
        max: number
    } | null>(null)
    const [loading, setLoading] = useState(false)

    const startGame = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/eggy-hatchy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create', friendId }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to fetch game')
            setGameId(data.id)
            setBoard(data.board)
            setBank(data.bank)
        } catch (err) {
            alert('Failed to load game')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleCellClick = (row: number, col: number) => {
        if (!board || !board[row][col].egg) {
            setSelected(null)
            setPreviewRange(null)
            return
        }

        if (!selected) {
            setSelected({ row, col })
            return
        }

        if (selected.row === row && selected.col === col) {
            setSelected(null)
            setPreviewRange(null)
            return
        }

        if (selected.row !== row && selected.col !== col) {
            setSelected(null)
            setPreviewRange(null)
            return
        }

        let mergeCells: { row: number; col: number }[] = []
        if (selected.row === row) {
            const minCol = Math.min(selected.col, col)
            const maxCol = Math.max(selected.col, col)
            for (let c = minCol; c <= maxCol; c++)
                mergeCells.push({ row, col: c })
        } else {
            const minRow = Math.min(selected.row, row)
            const maxRow = Math.max(selected.row, row)
            for (let r = minRow; r <= maxRow; r++)
                mergeCells.push({ row: r, col })
        }

        for (let i = 1; i < mergeCells.length - 1; i++) {
            const { row: r, col: c } = mergeCells[i]
            if (board[r][c].egg) {
                alert('Illegal merge: Egg in between.')
                setSelected(null)
                setPreviewRange(null)
                return
            }
        }

        let twinTriggered = false
        let extraTriggered = false
        mergeCells.forEach(({ row: r, col: c }) => {
            const cell = board[r][c]
            if (cell.createsTwin) twinTriggered = true
            if (cell.extraPoints) extraTriggered = true
        })

        const egg1 = board[selected.row][selected.col].egg!
        const egg2 = board[row][col].egg!
        const newEgg = fakeBreedingMerge(
            egg1,
            egg2,
            twinTriggered,
            extraTriggered
        )

        const preview = {
            min: newEgg.basePoints * newEgg.level,
            max:
                (newEgg.basePoints * newEgg.level + newEgg.basePoints * 1.5) *
                (newEgg.twin ? 2 : 1),
        }

        setPreviewRange(preview)

        if (
            window.confirm(
                `Merge eggs? Preview points range: ${preview.min} to ${preview.max}`
            )
        ) {
            fetch('/api/eggy-hatchy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'merge',
                    gameId,
                    source: { row: selected.row, col: selected.col },
                    target: { row, col },
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setBoard(data.board)
                    setPreviewRange(null)
                    setSelected(null)
                })
                .catch((err) => {
                    console.error(err)
                    alert('Merge failed on the server.')
                })
        } else {
            setSelected(null)
            setPreviewRange(null)
        }
    }

    const bankEgg = async () => {
        if (!selected) return

        setLoading(true)
        try {
            const res = await fetch('/api/eggy-hatchy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'bank',
                    gameId,
                    source: { row: selected.row, col: selected.col },
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to bank egg')
            setBoard(data.board)
            setBank(data.bank)
        } catch (err) {
            alert('Failed to bank egg')
            console.error(err)
        } finally {
            setLoading(false)
            setSelected(null)
        }
    }

    if (!board) {
        return (
            <div>
                <h2>Enter Friend ID to Start</h2>
                <input
                    type="text"
                    placeholder="Friend ID"
                    value={friendId}
                    onChange={(e) => setFriendId(e.target.value)}
                />
                <button
                    onClick={startGame}
                    disabled={loading || !friendId.trim()}
                >
                    {loading ? 'Loading...' : 'PLAY'}
                </button>
            </div>
        )
    }

    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
            }}
        >
            <div>
                <h2>Goals</h2>
                {bank &&
                    bank.goals.map((goal, index) => (
                        <li key={index}>{goal.points}</li>
                    ))}
            </div>
            <div
                style={{
                    flex: 1,
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                {previewRange && (
                    <div>
                        Preview: Points range between {previewRange.min} and{' '}
                        {previewRange.max}
                    </div>
                )}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                    }}
                >
                    {board.map((row, rIdx) =>
                        row.map((cell, cIdx) => (
                            <div
                                key={`${rIdx}-${cIdx}`}
                                style={{
                                    outline:
                                        selected?.row === rIdx &&
                                        selected?.col === cIdx
                                            ? '2px solid blue'
                                            : '2px solid transparent',
                                    outlineOffset: '-2px',
                                    position: 'relative',
                                    padding: '.5rem',
                                    aspectRatio: '1',
                                    display: 'grid',
                                    placeItems: 'center',
                                    backgroundColor: cell.egg?.twin
                                        ? '#90EE90'
                                        : 'transparent',
                                }}
                                onClick={() => handleCellClick(rIdx, cIdx)}
                            >
                                {cell.egg ? (
                                    <>
                                        <img
                                            loading="lazy"
                                            height="50"
                                            alt={`${cell.egg.name} Dragon Egg`}
                                            src={`https://namethategg.com/eggs/${transformToEggName(
                                                cell.egg.name
                                            )}.png`}
                                            style={{
                                                cursor: 'pointer',
                                            }}
                                        />
                                        <div
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                display: 'grid',
                                                placeItems: 'center',
                                                lineHeight: '0',
                                                backgroundColor: '#e1e1e1',
                                                border: '2px solid #8e8f8b',
                                                borderRadius: '50%',
                                                fontSize: '14px',
                                                color: 'black',
                                                textShadow: 'none',
                                            }}
                                        >
                                            {cell.egg.level}
                                        </div>
                                        {cell.egg.twin && (
                                            <div style={{ color: 'red' }}>
                                                Twin
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div />
                                )}
                                {cell.createsTwin && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                            fontSize: '10px',
                                        }}
                                    >
                                        CT
                                    </div>
                                )}
                                {cell.extraPoints && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            fontSize: '10px',
                                        }}
                                    >
                                        EP
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div>
                <h2>Bank</h2>
                {bank &&
                    bank.eggs.map((egg, index) => (
                        <li key={index}>
                            <img
                                loading="lazy"
                                height="50"
                                alt={`${egg.name} Dragon Egg`}
                                src={`https://namethategg.com/eggs/${transformToEggName(
                                    egg.name
                                )}.png`}
                            />
                            {egg.basePoints}
                        </li>
                    ))}
                {selected && (
                    <button
                        onClick={() => {
                            bankEgg()
                        }}
                    >
                        Bank
                    </button>
                )}
            </div>
        </div>
    )
}

export default Tool
