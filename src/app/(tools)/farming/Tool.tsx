'use client'
import LabelButton from '@/components/LabelButton'
import Dragon from '@/types/dragon'
import { FarmingDragon } from '@/types/farming'
import { useState, useEffect } from 'react'

interface ToolProps {
    initialDragons: Dragon[]
    regularElements: string[]
    epicElements: string[]
}

export default function Tool({
    initialDragons,
    regularElements,
    epicElements,
}: ToolProps) {
    // Reactive states for boosts and generators
    const [activeElements, setActiveElements] = useState<
        Record<string, boolean>
    >({})
    const [generators, setGenerators] = useState({
        Air: 0,
        Water: 0,
        Cold: 0,
        Lightning: 0,
        Plant: 0,
        Fire: 0,
    })
    // Reactive list of dragons (initially provided by page)
    const [dragonsList, setDragonsList] = useState<Dragon[]>(initialDragons)

    const [showElements, setShowElements] = useState<String[]>([])

    // When active elements or generators change, re-sort dragonsList
    useEffect(() => {
        setDragonsList(() => {
            let updatedList = [...initialDragons]

            // Filter by element if any are selected
            if (showElements.length > 0) {
                updatedList = updatedList.filter((dragon) =>
                    dragon.elements.some((el) => showElements.includes(el))
                )
            }

            return updatedList.sort(
                (a: FarmingDragon, b: FarmingDragon) =>
                    b.incomeWithBoosts - a.incomeWithBoosts
            )
        })
    }, [activeElements, generators, showElements])

    const calculateLevelForCap = (cap: number, dragon: FarmingDragon) => {
        const maxLevel = dragon.rarity === 'Primary' ? 21 : 20

        const elementBoosts = dragon.elements.reduce(
            (count, element) => count + (activeElements[element] ? 1 : 0),
            0
        )

        const generatorBoosts =
            Math.round(
                dragon.elements.reduce(
                    (totalBoost, element) =>
                        totalBoost + (generators[element] || 0) * 0.02,
                    0
                ) * 1e12
            ) / 1e12

        const s = Math.round(6000 / dragon.income![0])
        const boost =
            Math.round((1 + 0.3 * elementBoosts + generatorBoosts) * 1e12) /
            1e12

        for (let level = 1; level <= maxLevel; level++) {
            const income = Math.floor(
                6000 /
                    Math.floor(
                        Math.floor(
                            Math.round((s / (0.6 * level + 0.4)) * 1e12) / 1e12
                        ) / boost
                    )
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

    const toggleElement = (element: string) => {
        setActiveElements((prev) => ({
            ...prev,
            [element]: !prev[element],
        }))
    }

    const updateGeneratorCount = (element: string, count: number) => {
        setGenerators((prev) => ({
            ...prev,
            [element]: count,
        }))
    }

    const toggleOptionsDialog = () => {
        const dialog = document.querySelector(
            '#optionsDialog'
        ) as HTMLDialogElement
        const dialogIsOpen = dialog.open
        if (dialogIsOpen) {
            dialog.close()
        } else {
            dialog.showModal()
        }
    }

    const toggleShowElement = (element: string) => {
        setShowElements((prev) =>
            prev.includes(element)
                ? prev.filter((el) => el !== element)
                : [...prev, element]
        )
    }

    return (
        <>
            <p>
                An overview of what levels are needed to reach dragoncash (DC)
                earning rate roundings for each dragon.
            </p>
            <h2>Active boosts &amp; generators</h2>
            <ul className="farming__list">
                {regularElements.map((element) => (
                    <li key={element}>
                        <button
                            className="farming__element"
                            onClick={() => toggleElement(element)}
                        >
                            <img
                                src={`/elementIcons/${
                                    element +
                                    (activeElements[element] ? '_1' : '_0')
                                }.webp`}
                                alt={`${element} element boost`}
                            />
                        </button>
                    </li>
                ))}
                <li>
                    <button
                        className="farming__element"
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
                                            Math.max(0, generators[element] - 1)
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
                                            parseInt(e.target.value) || 0
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
                <table className="farmingTable">
                    <thead>
                        <tr>
                            <th>Dragon</th>
                            <th>Elements</th>
                            {roundingCaps.map((cap) => (
                                <th key={cap}>{cap}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dragonsList.map((dragon: FarmingDragon) => (
                            <tr key={dragon.name}>
                                <td>{dragon.name}</td>
                                <td className="farmingTable__elements">
                                    {dragon.elements.map((element) => {
                                        if (element === 'Rift') return null
                                        return (
                                            <img
                                                key={element}
                                                className="farming__dragonElement"
                                                src={`/elementIcons/${element}_1.webp`}
                                                alt={element}
                                            />
                                        )
                                    })}
                                </td>
                                {roundingCaps.map((cap) => (
                                    <td key={cap}>
                                        {calculateLevelForCap(cap, dragon)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <LabelButton
                    label="Options"
                    imageName="gearButton"
                    tag="button"
                    type="button"
                    onClick={toggleOptionsDialog}
                />
            </div>
            <dialog
                id="optionsDialog"
                className="dialog"
            >
                <button
                    aria-label="Close dialog"
                    className="dialog__closeButton"
                    type="button"
                    onClick={toggleOptionsDialog}
                >
                    <img
                        width="60"
                        height="60"
                        src="/buttons/xButton.png"
                    />
                </button>
                <div className="dialog__content">
                    <p>Filter dragons by elements:</p>
                    <ul className="farming__list">
                        {[...regularElements, ...epicElements].map(
                            (element) => (
                                <li key={element}>
                                    <button
                                        className="farming__element"
                                        onClick={() =>
                                            toggleShowElement(element)
                                        }
                                    >
                                        <img
                                            src={`/elementIcons/${
                                                element +
                                                (showElements.includes(element)
                                                    ? '_1'
                                                    : '_0')
                                            }.webp`}
                                            alt={`${element} element`}
                                        />
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </dialog>
        </>
    )
}
