'use client'

import { useEffect, useState } from 'react'
import Section from '@/components/Section/Section'
import Row from '@/components/Row/Row'
import Tool from './Tool'
import Link from 'next/link'

export default function NameThatEggPage() {
    // — mounted flag to detect “this is now running on the client” —
    const [hasMounted, setHasMounted] = useState(false)

    // — Helpers to read from localStorage (only safe inside useEffect) —
    const readBool = (key: string): boolean => {
        const v = localStorage.getItem(key)
        return v === 'true'
    }
    const readNumber = (key: string): number => {
        const v = localStorage.getItem(key)
        return v ? Number(v) : 0
    }

    // — OPTIONS default to false; we’ll overwrite after mount if there’s saved data —
    const [optionHardMode, setOptionHardMode] = useState(false)
    const [optionChestTimer, setOptionChestTimer] = useState(false)
    const [optionSaveScore, setOptionSaveScore] = useState(false)

    // — STATS default to 0; we’ll overwrite after mount if “saveScore” was on —
    const [statCorrect, setStatCorrect] = useState(0)
    const [statTotal, setStatTotal] = useState(0)

    // On mount, pull everything from localStorage:
    useEffect(() => {
        setHasMounted(true)

        // Read options
        const hard = readBool('optionHardMode')
        const timer = readBool('optionChestTimer')
        const save = readBool('optionSaveScore')

        setOptionHardMode(hard)
        setOptionChestTimer(timer)
        setOptionSaveScore(save)

        // If “Save Score” was already on, read stats:
        if (save) {
            setStatCorrect(readNumber('statCorrect'))
            setStatTotal(readNumber('statTotal'))
        }
    }, [])

    // — Persist each option change immediately —
    useEffect(() => {
        if (!hasMounted) return
        localStorage.setItem('optionHardMode', String(optionHardMode))
    }, [optionHardMode, hasMounted])

    useEffect(() => {
        if (!hasMounted) return
        localStorage.setItem('optionChestTimer', String(optionChestTimer))
    }, [optionChestTimer, hasMounted])

    useEffect(() => {
        if (!hasMounted) return
        localStorage.setItem('optionSaveScore', String(optionSaveScore))

        // If the user just turned “Save Score” OFF, zero everything out
        if (!optionSaveScore) {
            localStorage.setItem('statCorrect', '0')
            localStorage.setItem('statTotal', '0')
            setStatCorrect(0)
            setStatTotal(0)
        }
    }, [optionSaveScore, hasMounted])

    // — Persist stats whenever they change (only if Save Score is on) —
    useEffect(() => {
        if (!hasMounted) return
        if (optionSaveScore) {
            localStorage.setItem('statCorrect', String(statCorrect))
        }
    }, [statCorrect, optionSaveScore, hasMounted])

    useEffect(() => {
        if (!hasMounted) return
        if (optionSaveScore) {
            localStorage.setItem('statTotal', String(statTotal))
        }
    }, [statTotal, optionSaveScore, hasMounted])

    // — Option toggles —
    const updateOptionHardMode = () => setOptionHardMode((prev) => !prev)
    const updateOptionChestTimer = () => setOptionChestTimer((prev) => !prev)
    const updateOptionSaveScore = () => setOptionSaveScore((prev) => !prev)

    // — Stat updaters —
    const updateStatCorrect = (instruction: 'reset' | 'increment') => {
        setStatCorrect((prev) => (instruction === 'reset' ? 0 : prev + 1))
    }
    const updateStatTotal = (instruction: 'reset' | 'increment') => {
        setStatTotal((prev) => (instruction === 'reset' ? 0 : prev + 1))
    }
    const resetStats = () => {
        updateStatCorrect('reset')
        updateStatTotal('reset')
    }

    return (
        <main className="main">
            <Section
                title="Name That Egg"
                className="game"
                isH1
            >
                <Tool
                    optionHardMode={optionHardMode}
                    optionChestTimer={optionChestTimer}
                    updateStatCorrect={() => updateStatCorrect('increment')}
                    updateStatTotal={() => updateStatTotal('increment')}
                />
            </Section>
            <Section title="Practice Options">
                <form className="form">
                    <Row>
                        <label>
                            Hard Mode
                            <div>
                                <input
                                    type="checkbox"
                                    checked={optionHardMode}
                                    onChange={updateOptionHardMode}
                                />
                            </div>
                        </label>
                        <label>
                            Chest Timer
                            <div>
                                <input
                                    type="checkbox"
                                    checked={optionChestTimer}
                                    onChange={updateOptionChestTimer}
                                />
                            </div>
                        </label>
                        <label className="form__field">
                            Save Score
                            <div>
                                <input
                                    type="checkbox"
                                    checked={optionSaveScore}
                                    onChange={updateOptionSaveScore}
                                />
                            </div>
                        </label>
                    </Row>
                </form>
            </Section>
            <Section title="Practice Statistics">
                <Row>
                    <div className="statistic">
                        <span className="statistic__number">
                            {hasMounted ? statCorrect : 0}
                        </span>
                        <span>Correct</span>
                    </div>
                    <div className="statistic">
                        <span className="statistic__number">
                            {hasMounted ? statTotal : 0}
                        </span>
                        <span>Total Tries</span>
                    </div>
                </Row>
                <button
                    className="button button--info"
                    onClick={resetStats}
                >
                    Reset statistics
                </button>
            </Section>
            <Section title="Information">
                <p>
                    Name That Egg is a DragonVale event minigame. Correctly
                    guess an egg to get event currency. You can practice with
                    this replica as much as you want. Toggle between the hard
                    mode, a chest countdown timer and saving your score locally
                    in the browser.
                </p>
                <Link
                    className="link"
                    href={'./previous-tournaments'}
                >
                    You can see results from previously held community
                    tournaments here.
                </Link>
            </Section>
        </main>
    )
}
