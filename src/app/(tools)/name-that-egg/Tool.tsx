import React, { useEffect, useState } from 'react'
import allDragons from '@/data/dragons.json'
import hardModeNameList from './hardModeNameList'
import GameInfo from './GameInfo'
import transformToEggName from '@/utils/transformToEggName'
import styles from './Tool.module.scss'

function selectAtRandom(array: (object | string)[], numberOfElements: number) {
    const randomElements: (string | object)[] = []
    const arrayCopy = array.slice()

    for (let i = 0; i < numberOfElements; i++) {
        const randomIndex = Math.floor(Math.random() * arrayCopy.length)
        const randomElement = arrayCopy.splice(randomIndex, 1)[0]
        randomElements.push(randomElement)
    }

    return randomElements as (string | object)[] | string | object
}

const allDragonNames = allDragons.map((dragon) => dragon.name)

export default function Tool({
    optionHardMode,
    optionChestTimer,
    updateStatCorrect,
    updateStatTotal,
}) {
    const [options, setOptions] = useState([])
    const [gameEggData, setGameEggData] = useState()
    const [showInfo, setShowInfo] = useState(true)
    const [guessedName, setGuessedName] = useState('')
    const [isGuessCorrect, setIsGuessCorrect] = useState<boolean | null>(null)
    const [areButtonsDisabled, setAreButtonsDisabled] = useState(true)
    const [buttonText, setButtonText] = useState('Begin')
    const [isGameRunning, setIsGameRunning] = useState(false)
    const startGame = () => {
        let newGameOptions
        if (optionHardMode) {
            const chosenHardModeOptions = selectAtRandom(hardModeNameList, 1)
            newGameOptions = selectAtRandom(chosenHardModeOptions[0], 4)
        } else {
            newGameOptions = selectAtRandom(allDragonNames, 4)
        }
        const newGameAnswer = selectAtRandom(newGameOptions, 1)[0]
        setAreButtonsDisabled(false)
        setButtonText('Try again')
        setShowInfo(false)
        setIsGameRunning(true)
        setOptions(newGameOptions)
        setGameEggData(newGameAnswer)
    }
    const guessQuestion = (guess) => {
        setAreButtonsDisabled(true)
        setGuessedName(guess)
        setTimeout(() => {
            setGuessedName('???')
            let newGameOptions
            if (optionHardMode) {
                const chosenHardModeOptions = selectAtRandom(
                    hardModeNameList,
                    1
                )
                newGameOptions = selectAtRandom(chosenHardModeOptions[0], 4)
            } else {
                newGameOptions = selectAtRandom(allDragonNames, 4)
            }
            const newGameAnswer = selectAtRandom(newGameOptions, 1)[0]
            setOptions(newGameOptions)
            setGameEggData(newGameAnswer)
            setAreButtonsDisabled(false)
            setIsGuessCorrect(null)
        }, 1000)

        if (guess === gameEggData) {
            updateStatCorrect()
            setIsGuessCorrect(true)
        } else {
            setIsGuessCorrect(false)
        }
        updateStatTotal()
    }
    useEffect(() => {
        if (isGameRunning === false) {
            setAreButtonsDisabled(true)
        }
    }, [isGameRunning])

    return (
        <>
            {showInfo ? (
                <>
                    <h2>Practice Game</h2>
                    <p>Practice guessing the name of the egg. Good luck!</p>
                </>
            ) : (
                <>
                    <GameInfo
                        guessedName={guessedName}
                        isGuessCorrect={isGuessCorrect}
                        areButtonsDisabled={areButtonsDisabled}
                        optionChestTimer={optionChestTimer}
                    />
                    <img
                        id="gameEgg"
                        alt="Guess this egg"
                        width="50"
                        src={transformToEggName(gameEggData)}
                    />
                    <ul className={styles.gameoptions}>
                        {options.map((option) => {
                            return (
                                <li key={option}>
                                    <button
                                        className="button"
                                        onClick={() => {
                                            guessQuestion(option)
                                        }}
                                        disabled={areButtonsDisabled}
                                    >
                                        {option}
                                    </button>
                                </li>
                            )
                        })}
                    </ul>
                </>
            )}
            {!isGameRunning && (
                <>
                    <button
                        id="button"
                        onClick={startGame}
                        type="button"
                        className="button"
                    >
                        {buttonText}
                    </button>
                </>
            )}
        </>
    )
}
