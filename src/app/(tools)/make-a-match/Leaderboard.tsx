'use client'
import React, { useEffect, useState } from 'react'
import styles from './Leaderboard.module.scss'
import Image from 'next/image'
import { useSelector } from 'react-redux'
import supabase from '@/utils/supabaseClient'
import winners from '@/data/winnsers'

export default function Leaderboard() {
    const [rows, setRows] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const friendID = useSelector((state: any) => state.friend.friendID)

    const fetchData = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('highest_total_points_by_friend')
            .select('*')

        if (error) {
            console.error('Error fetching leaderboard:', error)
        }

        if (data) {
            const sorted = [...data].sort(
                (a, b) => b.max_total_points - a.max_total_points
            )
            setRows(sorted)
        }

        setLoading(false)
    }
    useEffect(() => {
        fetchData()
    }, [])

    if (!rows.length) {
        return <p>No leaderboard available.</p>
    }

    return (
        <>
            {loading === true ? (
                <p>Fetching leaderboard...</p>
            ) : (
                <ol className={styles.list}>
                    {rows.map((row, index) => (
                        <li
                            key={index}
                            className={styles.row}
                        >
                            <span className={styles.id}>
                                {index === 0 ? (
                                    <Image
                                        src="/eggyHatchy/crown.png"
                                        width={20}
                                        height={16}
                                        alt="Crown"
                                        title="Current winner"
                                    />
                                ) : (
                                    <>{index + 1}. </>
                                )}
                                {row.friend_id === friendID ? (
                                    <span
                                        style={{
                                            textDecoration: 'underline',
                                            textDecorationColor: '#36dc23',
                                        }}
                                    >
                                        {row.friend_id}
                                    </span>
                                ) : (
                                    <>{row.friend_id}</>
                                )}
                                {winners.includes(row.friend_id) && (
                                    <Image
                                        src="/eggyHatchy/ElderStageSymbol.webp"
                                        width={21}
                                        height={20}
                                        alt="Elder symbol"
                                        title="Previous winner"
                                    />
                                )}
                            </span>
                            <span>{row.max_total_points}</span>
                        </li>
                    ))}
                </ol>
            )}
            <button
                className={styles.button}
                disabled={loading}
                onClick={() => {
                    fetchData()
                }}
            >
                {loading ? 'Updating...' : 'Update leaderboard'}
            </button>
        </>
    )
}
