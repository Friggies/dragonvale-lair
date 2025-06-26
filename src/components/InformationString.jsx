import transformToEggName from '@/utils/transformToEggName'
import { useState, useEffect } from 'react'
import dragons from '@/data/dragons.json'

function reduceTimeString(timeStr, percent) {
    let hours = 0,
        minutes = 0,
        seconds = 0

    const hourMatch = timeStr.match(/(\d+)\s*H/i)
    const minuteMatch = timeStr.match(/(\d+)\s*M/i)
    const secondMatch = timeStr.match(/(\d+)\s*S/i)

    if (hourMatch) hours = parseInt(hourMatch[1])
    if (minuteMatch) minutes = parseInt(minuteMatch[1])
    if (secondMatch) seconds = parseInt(secondMatch[1])

    // Convert to total seconds
    let totalSeconds = hours * 3600 + minutes * 60 + seconds

    // Reduce by given percent
    totalSeconds = Math.floor(totalSeconds * (1 - percent / 100))

    // Convert back to H M S
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60

    return `${h > 0 ? h + ' H ' : ''}${m > 0 ? m + ' M ' : ''}${
        s > 0 ? s + ' S' : ''
    }`.trim()
}

export default function InformationString({ string, dragon }) {
    const [showEggColumn, setShowEggColumn] = useState(false)
    const [generalTipImages, setGeneralTipImages] = useState([])

    useEffect(() => {
        if (generalTipImages.some((img) => img !== '')) {
            setShowEggColumn(true)
        } else {
            setShowEggColumn(false)
        }
    }, [generalTipImages])

    if (!string) {
        return <p>No information available.</p>
    }

    const stringSections = string.split(',')
    let firstSection = stringSections[0].split(':')

    const generalTip =
        firstSection[1].includes('[') &&
        !firstSection[1].includes('elements') &&
        !firstSection[2].includes('%')
            ? firstSection[1] + ': ' + firstSection[2]
            : firstSection[1]

    useEffect(() => {
        setGeneralTipImages(generalTip.split('+').map((img) => img.trim()))
    }, [generalTip])

    const currentDragon = dragons.find((obj) => obj.name === dragon)

    return (
        <div className="row row--toColumn">
            {showEggColumn && (
                <div className="column">
                    <div>
                        {generalTipImages.map((img, index) => {
                            if (img.includes('[') || img.includes(']'))
                                return null

                            if (img.includes('Evolve')) {
                                const words = img.split(' ')
                                img = words[words.length - 1]
                                return (
                                    <img
                                        loading="lazy"
                                        key={index}
                                        height="60"
                                        alt={img + ' Dragon Egg'}
                                        src={transformToEggName(img)}
                                    />
                                )
                            } else if (
                                img[0] === img[0]?.toLowerCase() &&
                                img !== ''
                            ) {
                                img = img[0]?.toUpperCase() + img.slice(1)
                                return (
                                    <img
                                        key={index}
                                        height="60"
                                        alt={img + ' Element Flag'}
                                        src={`/flags/${img}.webp`}
                                    />
                                )
                            } else {
                                return (
                                    <img
                                        loading="lazy"
                                        key={index}
                                        height="60"
                                        alt={img + ' Dragon Egg'}
                                        src={transformToEggName(img)}
                                    />
                                )
                            }
                        })}
                    </div>
                    <p>
                        {generalTip
                            .replaceAll('+', ' + ')
                            .replace('[', '(')
                            .replace(']', ')')
                            .replaceAll('Evolve', 'Evolves')}
                    </p>
                    {currentDragon.breedingTime +
                        ' (' +
                        reduceTimeString(currentDragon.breedingTime, 20) +
                        ')'}
                </div>
            )}
            <div className="column">
                <p>
                    Base odds:
                    {firstSection[firstSection.length - 1].replace(' base', '')}
                </p>
                <p>
                    Social cloning:
                    {stringSections[1].replace('S:', '')}
                </p>
                <p>
                    Normal cloning:
                    {stringSections[2].replace('N:', '')}
                </p>
                <p>
                    Rift cloning:
                    {stringSections[3].replace('R:', '')}
                </p>
            </div>
        </div>
    )
}
