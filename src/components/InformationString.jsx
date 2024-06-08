import transformToEggName from '@/utils/transformToEggName'

export default function InformationString({ string }) {
    if (!string) {
        return <p>No information available.</p>
    }

    const stringSections = string.split(',')
    let firstSection = stringSections[0]
    firstSection = firstSection.split(':')

    const generalTip =
        firstSection[1].includes('[') &&
        !firstSection[1].includes('elements') &&
        !firstSection[2].includes('%')
            ? firstSection[1] + ': ' + firstSection[2]
            : firstSection[1]

    const generalTipImages = generalTip.split('+')

    return (
        <div className="row row--toColumn">
            {generalTipImages.length > 0 && (
                <div className="column">
                    <div>
                        {generalTipImages.map((img) => {
                            img = img.trim()
                            if (img.includes('[')) return
                            if (img.includes(']')) return
                            if (img.includes('Evolve')) {
                                const words = img.split(' ')
                                img = words[words.length - 1]
                                return (
                                    <img
                                        key={img}
                                        height="60"
                                        alt={img}
                                        src={`https://namethategg.com/eggs/${transformToEggName(
                                            img
                                        )}.png`}
                                    />
                                )
                            } else if (
                                img[0] === img[0]?.toLowerCase() &&
                                img !== ''
                            ) {
                                //element
                                img = img[0]?.toUpperCase() + img.slice(1)
                                return (
                                    <img
                                        key={img}
                                        height="60"
                                        alt={img}
                                        src={`/flags/${img}.webp`}
                                    />
                                )
                            } else {
                                //dragon
                                return (
                                    <img
                                        key={img}
                                        height="60"
                                        alt={img}
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
