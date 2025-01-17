import Head from 'next/head'
import dragons from '/public/dragons.json'

export default function Home() {
    const allDragons = dragons.filter((dragon) => {
        if (dragon.rarity.includes('Legendary')) return false
        if (dragon.rarity.includes('Mythic')) return false
        if (dragon.rarity.includes('Gemstone')) return false
        if (!Array.isArray(dragon.income)) return false
        if (dragon.income.length === 0) return false
        if (typeof dragon.income[0] === 'string') return false
        return true
    })
    allDragons.sort((a, b) => b.income[0] - a.income[0])

    const calculateLevelForCap = (cap, dragon) => {
        const maxLevel = dragon.rarity === 'Primary' ? 21 : 20
        const elementBoosts = 0
        const generatorBoosts = 0
        const s = 6000 / dragon.income[0]
        const boost = 1 + 0.3 * elementBoosts + 0.02 * generatorBoosts

        for (let level = 1; level <= maxLevel; level++) {
            const income = Math.floor(
                6000 / Math.floor(Math.floor(s / (0.6 * level + 0.4)) / boost)
            )

            if (income === cap) {
                return level
            }
        }

        return ''
    }

    const roundingCaps = [
        500, 545, 600, 666, 750, 857, 1000, 1200, 1500, 2000, 3000, 6000,
    ]

    return (
        <>
            <Head>
                <title>DragonVale DC Farming - The DragonVale Lair</title>
                <meta
                    name="description"
                    content=""
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">Levels for DC roundings</h1>
                    <p>
                        An overview of what levels are needed to reach
                        DragonCash earning rate roundings for each dragon. I am
                        currently working on adding element boosts and
                        generators. See{' '}
                        <a
                            href="https://www.reddit.com/r/dragonvale/comments/1dmie9g/a_revised_guide_to_dc_farming_v3_with_improved/"
                            target="_blank"
                            className="link"
                        >
                            this
                        </a>{' '}
                        Reddit post for more information.
                    </p>
                    <div className="table-wrapper">
                        <div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Dragon</th>
                                        <th>500</th>
                                        <th>545</th>
                                        <th>600</th>
                                        <th>666</th>
                                        <th>750</th>
                                        <th>857</th>
                                        <th>1k</th>
                                        <th>1.2k</th>
                                        <th>1.5k</th>
                                        <th>2k</th>
                                        <th>3k</th>
                                        <th>6k</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allDragons.map((dragon) => (
                                        <tr>
                                            <td>{dragon.name}</td>
                                            {roundingCaps.map((cap) => (
                                                <td>
                                                    {calculateLevelForCap(
                                                        cap,
                                                        dragon
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}
