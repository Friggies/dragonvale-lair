import transformToEggName from '@/utils/transformToEggName'
import { useState, useEffect } from 'react'

export default function InformationString({ string }) {
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
                                        src={`https://namethategg.com/eggs/${transformToEggName(
                                            img
                                        )}.png`}
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
                                        src={`https://namethategg.com/eggs/${transformToEggName(
                                            img
                                        )}.png`}
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
