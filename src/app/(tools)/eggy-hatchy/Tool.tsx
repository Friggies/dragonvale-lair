'use client'
import transformToEggName from '@/utils/transformToEggName'
import React, { useEffect, useState } from 'react'
import styles from './Tool.module.scss'

// ---- Types and Fake Breeding Logic ----

export interface Egg {
    name: string
    level: number
    points: number
    elements: string[]
    twin?: boolean
}

export interface Goal {
    element: string
    level: number
    amount: number
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

// ---- Main Game Component ----

const Tool: React.FC = () => {
    const [friendId, setFriendId] = useState('')
    const [gameId, setGameId] = useState<string | null>(null)
    const [board, setBoard] = useState<Board | null>(null)
    const [bank, setBank] = useState<Bank | null>(null)
    const [currentGamePoints, setCurrentGamePoints] = useState<number>(0)
    const [selected, setSelected] = useState<{
        row: number
        col: number
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
            return
        }

        if (!selected) {
            setSelected({ row, col })
            return
        }

        if (selected.row === row && selected.col === col) {
            setSelected(null)
            return
        }

        if (selected.row !== row && selected.col !== col) {
            setSelected(null)
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
                return
            }
        }

        if (window.confirm(`Merge eggs?`)) {
            setLoading(true)
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
                    setSelected(null)
                })
                .catch((err) => {
                    console.error(err)
                    alert('Merge failed on the server.')
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setSelected(null)
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

    useEffect(() => {
        let points = 0
        bank?.eggs.forEach((egg) => {
            points += egg.points
        })
        setCurrentGamePoints(points)
    }, [bank])

    if (!board) {
        return (
            <div className={styles.column}>
                <p>
                    Please input your Friend ID or press "Begin" to play
                    anonymously.{' '}
                    <a
                        href="#"
                        className="link"
                    >
                        What is your Friend ID?
                    </a>
                </p>
                <div className="selector">
                    <input
                        type="text"
                        className={styles.friendId}
                        placeholder="Friend ID"
                        value={friendId}
                        onChange={(e) => setFriendId(e.target.value)}
                    />
                </div>
                <button
                    className={styles.startButton}
                    onClick={startGame}
                    disabled={loading}
                >
                    {loading ? 'Generating board...' : 'Begin'}
                </button>
            </div>
        )
    }

    return (
        <div className={styles.row}>
            <div className={styles.column}>
                <h2>Goals</h2>
                <div className={styles.board}>
                    {bank &&
                        bank.goals.map((goal, index) => (
                            <li
                                key={index}
                                className={styles.goal}
                            >
                                <p className={styles.goalText}>
                                    {
                                        bank.eggs.filter(
                                            (egg) =>
                                                egg.level >= goal.level &&
                                                egg.elements.includes(
                                                    goal.element
                                                )
                                        ).length
                                    }{' '}
                                    / {goal.amount} Eggs
                                </p>
                                <img
                                    height="50"
                                    alt={goal.element + ' Element Flag'}
                                    src={`/flags/${goal.element}.webp`}
                                />
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        display: 'grid',
                                        placeItems: 'center',
                                        lineHeight: '0',
                                        backgroundColor: '#e1e1e1',
                                        border: '2px solid #8e8f8b',
                                        borderRadius: '50%',
                                        fontSize: '14px',
                                        color: 'black',
                                        textShadow: 'none',
                                        userSelect: 'none',
                                    }}
                                >
                                    {goal.level}
                                </div>
                            </li>
                        ))}
                </div>
            </div>
            <div className={styles.column + ' ' + styles.columnLarge}>
                <div className={styles.paper}>
                    <div className={styles.grid}>
                        {board.map((row, rIdx) =>
                            row.map((cell, cIdx) => (
                                <div
                                    key={`${rIdx}-${cIdx}`}
                                    className={styles.cell}
                                    style={{
                                        outline:
                                            selected?.row === rIdx &&
                                            selected?.col === cIdx
                                                ? '2px solid #107641'
                                                : '2px solid transparent',
                                        background: cell.egg?.twin
                                            ? 'radial-gradient(circle, #0088ff 30%, transparent 70%)'
                                            : 'transparent',
                                        cursor: cell.egg
                                            ? 'pointer'
                                            : 'not-allowed',
                                        pointerEvents: loading
                                            ? 'none'
                                            : 'auto',
                                        opacity: loading ? 0.5 : 1,
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
                                                    zIndex: 1,
                                                }}
                                            />
                                            <div
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    position: 'absolute',
                                                    top: '5px',
                                                    right: '5px',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    lineHeight: '0',
                                                    backgroundColor: '#e1e1e1',
                                                    border: '2px solid #8e8f8b',
                                                    borderRadius: '50%',
                                                    fontSize: '14px',
                                                    color: 'black',
                                                    textShadow: 'none',
                                                    userSelect: 'none',
                                                    zIndex: 1,
                                                }}
                                            >
                                                {cell.egg.level}
                                            </div>
                                        </>
                                    ) : (
                                        <div aria-label="No egg" />
                                    )}
                                    {cell.createsTwin && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform:
                                                    'translate(-50%, -50%)',
                                            }}
                                        >
                                            <img
                                                alt="Creates twin"
                                                src="/eggyHatchy/twin.png"
                                                height="30"
                                            />
                                        </div>
                                    )}
                                    {cell.extraPoints && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform:
                                                    'translate(-50%, -50%)',
                                            }}
                                        >
                                            <img
                                                alt="Extra Points"
                                                src="/eggyHatchy/food.png"
                                                height="30"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                {selected && (
                    <div className={styles.infobar}>
                        {board[selected.row][selected.col].egg?.elements.map(
                            (element) => (
                                <img
                                    key={element}
                                    height="40"
                                    alt={element + ' Element Flag'}
                                    src={`/flags/${element}_Flag.png`}
                                />
                            )
                        )}

                        {board[selected.row][selected.col].egg?.points}
                        {' Points'}
                    </div>
                )}
            </div>
            <div className={styles.column}>
                <h2>{currentGamePoints} Points</h2>
                <div className={styles.board}>
                    {bank?.eggs.length ? (
                        bank.eggs.map((egg, index) => (
                            <li
                                key={index}
                                className={styles.bankedEgg}
                            >
                                <img
                                    loading="lazy"
                                    height="50"
                                    alt={`${egg.name} Dragon Egg`}
                                    src={`https://namethategg.com/eggs/${transformToEggName(
                                        egg.name
                                    )}.png`}
                                />
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        position: 'absolute',
                                        top: '-5px',
                                        right: '-5px',
                                        display: 'grid',
                                        placeItems: 'center',
                                        lineHeight: '0',
                                        background: '#e1e1e1',
                                        color: 'black',
                                        border: '2px solid #8e8f8b',
                                        borderRadius: '50%',
                                        fontSize: '14px',
                                        textShadow: 'none',
                                        userSelect: 'none',
                                        zIndex: 1,
                                    }}
                                >
                                    {egg.level}
                                </div>
                                <span
                                    className={styles.bankedEggPoints}
                                    style={{
                                        background: egg.twin
                                            ? 'radial-gradient(circle,rgb(59, 164, 255) 60%, #0088ff 100%)'
                                            : 'radial-gradient(circle, #2e679a 60%, #27468b 100%)',
                                    }}
                                >
                                    {egg.points}
                                </span>
                            </li>
                        ))
                    ) : (
                        <p>No eggs banked</p>
                    )}
                </div>
                <button
                    className={styles.bankButton}
                    disabled={!selected || loading}
                    onClick={() => {
                        bankEgg()
                    }}
                >
                    {loading ? 'Wait...' : 'Bank'}
                </button>
            </div>
        </div>
    )
}

export default Tool
