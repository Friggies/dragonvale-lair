import Head from 'next/head'
import dragons from '/public/dragons.json'
import regularElements from '/public/regularElements'
import { useEffect, useState } from 'react'

export default function Home() {
    const [activeElements, setActiveElements] = useState({})
    const [generators, setGenerators] = useState({
        Air: 0,
        Water: 0,
        Cold: 0,
        Lightning: 0,
        Plant: 0,
        Fire: 0,
    })
    const [test, setTest] = useState([])

    useEffect(() => {
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
        allDragons.map((dragon) => (dragon.incomeWithBoosts = dragon.income[0]))
        setTest(allDragons)
    }, [])

    const calculateLevelForCap = (cap, dragon) => {
        const maxLevel = dragon.rarity === 'Primary' ? 21 : 20

        const elementBoosts = dragon.elements.reduce(
            (count, element) => count + (activeElements[element] ? 1 : 0),
            0
        )

        const generatorBoosts = dragon.elements.reduce(
            (totalBoost, element) =>
                totalBoost + (generators[element] || 0) * 0.02,
            0
        )

        const s = Math.floor(6000 / dragon.income[0])
        const boost = 1 + 0.3 * elementBoosts + generatorBoosts

        for (let level = 1; level <= maxLevel; level++) {
            const income = Math.floor(
                6000 / Math.floor(Math.floor(s / (0.6 * level + 0.4)) / boost)
            )
            if (level === 1) {
                dragon.incomeWithBoosts = income
            }
            if (income === cap) {
                return level
            }
        }

        return ''
    }

    const roundingCaps = [
        500, 545, 600, 666, 750, 857, 1000, 1200, 1500, 2000, 3000, 6000,
    ]

    const toggleElement = (element) => {
        setActiveElements((prev) => ({
            ...prev,
            [element]: !prev[element],
        }))
    }

    const updateGeneratorCount = (element, count) => {
        setGenerators((prev) => ({
            ...prev,
            [element]: count,
        }))
    }

    useEffect(() => {
        setTest((prev) =>
            [...prev].sort((a, b) => b.incomeWithBoosts - a.incomeWithBoosts)
        )
    }, [activeElements, generators])

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
                <section className="card farming">
                    <h1 className="card__title">Levels for DC roundings</h1>
                    <p>
                        An overview of what levels are needed to reach
                        DragonCash earning rate roundings for each dragon.
                    </p>
                    <h2>Active boosts & generators</h2>
                    <ul className="farming__list">
                        {regularElements.map((element) => (
                            <li key={element}>
                                <button
                                    className={'farming__element'}
                                    onClick={() => toggleElement(element)}
                                >
                                    <img
                                        src={`/elementIcons/${
                                            element +
                                            (activeElements[element]
                                                ? '_1'
                                                : '_0')
                                        }.webp`}
                                        alt={`${element} element boost`}
                                    />
                                </button>
                            </li>
                        ))}
                        <li>
                            <button
                                className={'farming__element'}
                                onClick={() => toggleElement('Monolith')}
                            >
                                <img
                                    src={`/elementIcons/Monolith${
                                        activeElements['Monolith'] ? '_1' : '_0'
                                    }.webp`}
                                    alt="Monolith element boost"
                                />
                            </button>
                        </li>
                    </ul>
                    <ul className="farming__list">
                        {Object.keys(generators).map((element) => (
                            <li
                                key={element}
                                className="farming__generator-wrapper"
                            >
                                <label className="farming__generator">
                                    {element} Generators:
                                    <div className="selector farming__selector-wrapper">
                                        <button
                                            onClick={() =>
                                                updateGeneratorCount(
                                                    element,
                                                    Math.max(
                                                        0,
                                                        generators[element] - 1
                                                    )
                                                )
                                            }
                                            className="farming__generator-button farming__generator-button--left"
                                        >
                                            -
                                        </button>
                                        <input
                                            className="farming__selector"
                                            type="number"
                                            inputMode="numeric"
                                            value={generators[element]}
                                            min="0"
                                            onFocus={(e) => e.target.select()}
                                            onChange={(e) =>
                                                updateGeneratorCount(
                                                    element,
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                        />
                                        <button
                                            onClick={() =>
                                                updateGeneratorCount(
                                                    element,
                                                    generators[element] + 1
                                                )
                                            }
                                            className="farming__generator-button"
                                        >
                                            +
                                        </button>
                                    </div>
                                </label>
                            </li>
                        ))}
                    </ul>
                    <div className="table-wrapper">
                        <div>
                            <table className="farmingTable">
                                <thead>
                                    <tr>
                                        <th>
                                            <abbr title="Boosted lvl. 1 earning rate">
                                                Base
                                            </abbr>
                                        </th>
                                        <th>Dragon</th>
                                        {roundingCaps.map((cap) => (
                                            <th key={cap}>{cap}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {test.map((dragon) => (
                                        <tr key={dragon.name}>
                                            <td>{dragon.incomeWithBoosts}</td>
                                            <td>{dragon.name}</td>
                                            {roundingCaps.map((cap) => (
                                                <td key={cap}>
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
                <section className="card">
                    <h2 className="card__title">Information</h2>
                    <p>No information yet...</p>
                </section>
            </main>
        </>
    )
}
