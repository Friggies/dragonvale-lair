'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import styles from './Tool.module.scss'
import { v4 as uuidv4 } from 'uuid'
import transformToEggName from '@/utils/transformToEggName'
import { dragonsWithImages } from './dragonsWithImages'

type CardType = 'dragon' | 'egg'

interface Card {
    id: string
    type: CardType
    name: string
    revealed: boolean
    matched: boolean
}

const getRandomObjects = <T,>(arr: T[], count = 10): T[] => {
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

const makeShuffledBoard = (pairCount = 10): Card[] => {
    const pairs = getRandomObjects(dragonsWithImages, pairCount).flatMap(
        (dragonName: string) => [
            {
                id: uuidv4(),
                type: 'dragon' as const,
                name: dragonName,
                revealed: false,
                matched: false,
            },
            {
                id: uuidv4(),
                type: 'egg' as const,
                name: dragonName,
                revealed: false,
                matched: false,
            },
        ]
    )

    // Fisher–Yates
    for (let i = pairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
    }
    return pairs
}

const MakeAMatch: React.FC = () => {
    // Build the initial board immediately (no start screen)
    const [board, setBoard] = useState<Card[]>(() => makeShuffledBoard(10))
    const [firstChoice, setFirstChoice] = useState<Card | null>(null)
    const [secondChoice, setSecondChoice] = useState<Card | null>(null)
    const [disabled, setDisabled] = useState(false)
    const [guesses, setGuesses] = useState(0)
    const [gameOver, setGameOver] = useState(false)

    const handleChoice = (card: Card) => {
        if (disabled || card.revealed || card.matched) return

        if (!firstChoice) {
            setFirstChoice({ ...card, revealed: true })
            setBoard((prev) =>
                prev.map((c) =>
                    c.id === card.id ? { ...c, revealed: true } : c
                )
            )
            return
        }

        if (!secondChoice && card.id !== firstChoice.id) {
            setSecondChoice({ ...card, revealed: true })
            setBoard((prev) =>
                prev.map((c) =>
                    c.id === card.id ? { ...c, revealed: true } : c
                )
            )
        }
    }

    useEffect(() => {
        if (!firstChoice || !secondChoice) return

        setDisabled(true)
        setGuesses((g) => g + 1)

        const isMatch =
            firstChoice.name === secondChoice.name &&
            firstChoice.type !== secondChoice.type

        if (isMatch) {
            setBoard((prev) =>
                prev.map((c) =>
                    c.name === firstChoice.name
                        ? { ...c, matched: true, revealed: true }
                        : c
                )
            )
            // brief sync reset so the user can keep playing
            setFirstChoice(null)
            setSecondChoice(null)
            setDisabled(false)
        } else {
            // Show both for a moment, then hide
            setTimeout(() => {
                setBoard((prev) =>
                    prev.map((c) =>
                        c.id === firstChoice.id || c.id === secondChoice.id
                            ? { ...c, revealed: false }
                            : c
                    )
                )
                setFirstChoice(null)
                setSecondChoice(null)
                setDisabled(false)
            }, 3000)
        }
    }, [firstChoice, secondChoice])

    // Check for completion whenever the board changes
    useEffect(() => {
        if (board.length && board.every((c) => c.matched)) {
            setGameOver(true)
        }
    }, [board])

    const resetGame = () => {
        setBoard(makeShuffledBoard(10))
        setFirstChoice(null)
        setSecondChoice(null)
        setDisabled(false)
        setGuesses(0)
        setGameOver(false)
    }

    return (
        <>
            {/* Minimal top bar with guesses; no start screen */}
            <span>
                Guesses: <strong>{guesses}</strong>
            </span>

            {/* Grid */}
            <div className={styles.board}>
                {board.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => handleChoice(card)}
                        className={styles.square}
                    >
                        {(card.revealed || card.matched) && (
                            <>
                                {card.type === 'dragon' ? (
                                    <Image
                                        className={styles.dragonImage}
                                        alt={card.name}
                                        src={`https://evrjimpvbkritkiantsx.supabase.co/storage/v1/object/public/dragons/${card.name}_baby_day_base.png`}
                                        width={300}
                                        height={200}
                                    />
                                ) : (
                                    <Image
                                        className={styles.eggImage}
                                        alt={`${card.name} Egg`}
                                        src={transformToEggName(card.name)}
                                        width={50}
                                        height={64}
                                    />
                                )}
                            </>
                        )}
                        <Image
                            className={styles.sandPatch}
                            alt=""
                            src="/make-a-match/sand-patch.webp"
                            width={150}
                            height={100}
                        />
                    </div>
                ))}
            </div>

            {/* Completion message + reset */}
            {gameOver && (
                <button
                    className="button button--wide"
                    onClick={resetGame}
                >
                    Play again
                </button>
            )}
        </>
    )
}

export default MakeAMatch
