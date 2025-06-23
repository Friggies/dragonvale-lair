import { useEffect, useState } from 'react'

function formatTime(input) {
    if (typeof input === 'string') {
        return input // If input is already a string, return it as is
    } else if (typeof input === 'number') {
        // If input is a number, format it as MM:SS:Milliseconds
        const absInput = Math.abs(input)
        const minutes = Math.floor(absInput / (1000 * 60))
        const seconds = Math.floor((absInput % (1000 * 60)) / 1000)
        const milliseconds = absInput % 1000

        const formattedMinutes =
            minutes > 0 ? String(minutes).padStart(2, '0') + ':' : ''
        const formattedSeconds = String(seconds).padStart(2, '0')
        const formattedMilliseconds = String(milliseconds)
            .padStart(2, '0')
            .substring(0, 2)

        return (
            (input < 0 ? '-' : '') +
            `${formattedMinutes}${formattedSeconds}:${formattedMilliseconds}`
        )
    } else {
        return 'Invalid input'
    }
}

export default function GameInfo({
    guessedName,
    isGuessCorrect,
    areButtonsDisabled,
    optionChestTimer,
}) {
    const [timeLeft, setTimeLeft] = useState<any>(5000)
    const [className, setClassname] = useState('')

    useEffect(() => {
        if (isGuessCorrect === true) {
            setClassname('green')
        } else if (isGuessCorrect === false) {
            setClassname('red')
        } else {
            setClassname('')
        }
    }, [isGuessCorrect])

    useEffect(() => {
        let timer

        if (!areButtonsDisabled && optionChestTimer) {
            setTimeLeft(5000)
            timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime == 0) {
                        setClassname('red')
                    } else if (prevTime == -5000) {
                        clearInterval(timer)
                        return 'No golden chest'
                    }
                    return prevTime - 10
                })
            }, 10)
        } else {
            setTimeLeft(guessedName)
            clearInterval(timer)
        }
        return () => clearInterval(timer)
    }, [areButtonsDisabled])

    return (
        <div className={className}>
            {optionChestTimer ? (
                <>{formatTime(timeLeft)}</>
            ) : guessedName ? (
                guessedName
            ) : (
                '???'
            )}
        </div>
    )
}
