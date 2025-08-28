'use client'

import React, { useEffect, useState } from 'react'
import styles from './Tool.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { setFriendID } from '@/store/friendSlice'
import Image from 'next/image'
import transformToEggName from '@/utils/transformToEggName'

interface Card {
    id: string
    type: 'dragon' | 'egg'
    name: string
    revealed: boolean
    matched: boolean
}

const MakeAMatch: React.FC = () => {
    const [board, setBoard] = useState<Card[]>([])
    const [firstChoice, setFirstChoice] = useState<Card | null>(null)
    const [secondChoice, setSecondChoice] = useState<Card | null>(null)
    const [disabled, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
    const friendID = useSelector((state: any) => state.friend.friendID)
    const dispatch = useDispatch()

    const startGame = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/make-a-match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create' }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to create game')
            setBoard(data.board)
            console.log(data.board)
        } catch (err) {
            console.error(err)
            alert('Failed to start game')
        } finally {
            setLoading(false)
            resetTurn()
        }
    }

    const handleChoice = (card: Card) => {
        if (disabled || card.revealed || card.matched) return
        if (!firstChoice) {
            setFirstChoice({ ...card, revealed: true })
            setBoard((prev) =>
                prev.map((c) =>
                    c.id === card.id ? { ...c, revealed: true } : c
                )
            )
        } else if (!secondChoice && card.id !== firstChoice.id) {
            setSecondChoice({ ...card, revealed: true })
            setBoard((prev) =>
                prev.map((c) =>
                    c.id === card.id ? { ...c, revealed: true } : c
                )
            )
        }
    }

    useEffect(() => {
        if (firstChoice && secondChoice) {
            setDisabled(true)
            if (
                (firstChoice.type === 'dragon' &&
                    secondChoice.type === 'egg' &&
                    firstChoice.name === secondChoice.name) ||
                (firstChoice.type === 'egg' &&
                    secondChoice.type === 'dragon' &&
                    firstChoice.name === secondChoice.name)
            ) {
                setBoard((prev) =>
                    prev.map((c) =>
                        c.name === firstChoice.name
                            ? { ...c, matched: true, revealed: true }
                            : c
                    )
                )
                resetTurn()
            } else {
                setTimeout(() => {
                    setBoard((prev) =>
                        prev.map((c) =>
                            c.id === firstChoice.id || c.id === secondChoice.id
                                ? { ...c, revealed: false }
                                : c
                        )
                    )
                    resetTurn()
                }, 3000)
            }
        }
    }, [firstChoice, secondChoice])

    const resetTurn = () => {
        setFirstChoice(null)
        setSecondChoice(null)
        setDisabled(false)
    }

    return (
        <>
            {!board.length ? (
                <>
                    <br />
                    <p>
                        Please input your Friend ID or press "Begin" to play
                        anonymously.{' '}
                        <a
                            href="#friendIdText"
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
                            value={friendID}
                            onChange={(e) =>
                                dispatch(setFriendID(e.target.value))
                            }
                        />
                    </div>
                    <button
                        className={styles.startButton}
                        onClick={startGame}
                        disabled={loading}
                    >
                        {loading ? 'Generating board...' : 'Play'}
                    </button>
                </>
            ) : (
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
                                            alt={card.name + ' Egg'}
                                            src={transformToEggName(card.name)}
                                            width={50}
                                            height={64}
                                        />
                                    )}
                                </>
                            )}
                            <Image
                                className={styles.snowPatch}
                                alt=""
                                src="/make-a-match/sand-patch.webp"
                                width={150}
                                height={100}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default MakeAMatch
