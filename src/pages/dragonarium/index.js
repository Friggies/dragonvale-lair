import Head from 'next/head'
import { useEffect, useState } from 'react'
import dragons from '/public/dragons.json'
import regularElements from '/public/regularElements'
import currentlyAvailable from '/public/currentlyAvailable'
import LabelButton from '@/components/LabelButton'
import transformToEggName from '@/utils/transformToEggName'

export default function Home() {
    const allDragons = dragons.filter((dragon) => {
        if (dragon.rarity.includes('Legendary')) return false
        if (dragon.rarity.includes('Mythic')) return false
        return true
    })
    const [userDragons, setUserDragons] = useState([])
    const [missingDragons, setMissingDragons] = useState(allDragons)
    const [isLoaded, setIsLoaded] = useState(false)
    const [userDragonsSearch, setUserDragonsSearch] = useState('')
    const [missingDragonsSearch, setMissingDragonsSearch] = useState('')

    const epicElements = [
        'Apocalypse',
        'Aura',
        'Chrysalis',
        'Crystalline',
        'Dream',
        'Galaxy',
        'Gemstone',
        'Hidden',
        'Melody',
        'Monolith',
        'Moon',
        'Olympus',
        'Ornamental',
        'Rainbow',
        'Seasonal',
        'Snowflake',
        'Sun',
        'Surface',
        'Treasure',
        'Zodiac',
    ]

    // On component mount, load data from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedDragons = localStorage.getItem('userDragons')
            if (storedDragons) {
                const userDragonsList = JSON.parse(storedDragons)
                setUserDragons(userDragonsList)

                // Filter out the dragons already in userDragons from missingDragons
                const updatedMissingDragons = allDragons.filter(
                    (dragon) =>
                        !userDragonsList.some(
                            (userDragon) => userDragon.name === dragon.name
                        )
                )
                setMissingDragons(updatedMissingDragons)
            }
            setIsLoaded(true)
        }
    }, [])

    // Save user dragons to localStorage when the state changes
    useEffect(() => {
        if (isLoaded && typeof window !== 'undefined') {
            localStorage.setItem('userDragons', JSON.stringify(userDragons))
        }
    }, [userDragons, isLoaded]) // Run only after the initial load and when the dragons change

    const collator = new Intl.Collator('en', {
        numeric: true,
        sensitivity: 'base',
    })
    const addDragon = (dragon) => {
        setUserDragons((prev) =>
            [dragon, ...prev].sort((a, b) => {
                return collator.compare(a.name, b.name)
            })
        )

        setMissingDragons((prev) => prev.filter((d) => d.name !== dragon.name))
    }

    const removeDragon = (dragon) => {
        setUserDragons((prev) => prev.filter((d) => d.name !== dragon.name))
        setMissingDragons((prev) => [...prev, dragon])
    }

    const canDragonBreed = (dragon) => {
        // Check if the dragon is limited and not in the currentlyAvailable list
        if (
            dragon.availability === 'LIMITED' &&
            !currentlyAvailable.includes(dragon.name)
        ) {
            return false
        }

        // Create a list of all elements and dragons that the user currently has
        const userElements = new Set(
            userDragons.flatMap((userDragon) =>
                userDragon.elements.map((element) => element.toLowerCase())
            )
        )
        const userDragonNames = new Set(
            userDragons.map((userDragon) => userDragon.name)
        )
        if (dragon.comb === 'elements-4') {
            return userElements.length >= 4
        }

        // Check dragon combo
        return (
            dragon.combo &&
            dragon.combo.every((requiredDragonOrElement) => {
                // If it's a dragon name, check if the user has that dragon
                if (userDragonNames.has(requiredDragonOrElement)) {
                    return true
                }
                // If it's an element, check if the user has a dragon with that element
                return userElements.has(requiredDragonOrElement)
            })
        )
    }

    useEffect(() => {
        setMissingDragons((prev) =>
            [...prev]
                .map((dragon) => ({
                    ...dragon,
                    userCanBreed: canDragonBreed(dragon),
                }))
                .sort((a, b) => {
                    if (a.userCanBreed && !b.userCanBreed) return -1
                    if (!a.userCanBreed && b.userCanBreed) return 1
                    return 0
                })
        )
    }, [userDragons])

    const toggleOptionsDialog = () => {
        const dialog = document.querySelector('#optionsDialog')
        const dialogIsOpen = dialog.open
        if (dialogIsOpen) {
            dialog.close()
        } else {
            dialog.showModal()
        }
    }
    const toggleHelpDialog = () => {
        const dialog = document.querySelector('#helpDialog')
        const dialogIsOpen = dialog.open
        if (dialogIsOpen) {
            dialog.close()
        } else {
            dialog.showModal()
        }
    }

    const addPermanentDragons = (element) => {
        let dragonsToAdd
        if (element === '*') {
            dragonsToAdd = missingDragons.filter(
                (dragon) =>
                    dragon.elements.some((dragonElement) =>
                        regularElements.includes(dragonElement)
                    ) && dragon.availability === 'PERMANENT'
            )
        } else {
            dragonsToAdd = missingDragons.filter(
                (dragon) =>
                    dragon.elements.includes(element) &&
                    dragon.availability === 'PERMANENT'
            )
        }

        setUserDragons((prev) =>
            [...dragonsToAdd, ...prev].sort((a, b) => {
                return collator.compare(a.name, b.name)
            })
        )
        setMissingDragons((prev) =>
            prev.filter(
                (dragon) =>
                    !dragonsToAdd.some(
                        (addedDragon) => addedDragon.name === dragon.name
                    )
            )
        )
    }

    const addEpicDragons = (element) => {
        let dragonsToAdd
        if (element === '*') {
            dragonsToAdd = missingDragons.filter((dragon) =>
                dragon.elements.some((dragonElement) =>
                    epicElements.includes(dragonElement)
                )
            )
        } else {
            dragonsToAdd = missingDragons.filter((dragon) =>
                dragon.elements.includes(element)
            )
        }

        setUserDragons((prev) =>
            [...dragonsToAdd, ...prev].sort((a, b) => {
                return collator.compare(a.name, b.name)
            })
        )
        setMissingDragons((prev) =>
            prev.filter(
                (dragon) =>
                    !dragonsToAdd.some(
                        (addedDragon) => addedDragon.name === dragon.name
                    )
            )
        )
    }

    useEffect(() => {
        if (missingDragonsSearch === '') {
            setMissingDragons((prev) =>
                prev.map((dragon) => ({
                    ...dragon,
                    hiddenBySearch: false,
                }))
            )
        } else {
            setMissingDragons((prev) =>
                prev.map((dragon) => ({
                    ...dragon,
                    hiddenBySearch: !dragon.name
                        .toLowerCase()
                        .includes(missingDragonsSearch.toLowerCase()),
                }))
            )
        }
    }, [missingDragonsSearch])

    useEffect(() => {
        if (userDragonsSearch === '') {
            setUserDragons((prev) =>
                prev.map((dragon) => ({
                    ...dragon,
                    hiddenBySearch: false,
                }))
            )
        } else {
            setUserDragons((prev) =>
                prev.map((dragon) => ({
                    ...dragon,
                    hiddenBySearch: !dragon.name
                        .toLowerCase()
                        .includes(userDragonsSearch.toLowerCase()),
                }))
            )
        }
    }, [userDragonsSearch])

    return (
        <>
            <Head>
                <title>DragonVale Dragonarium - The DragonVale Lair</title>
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
                <section className="card dragonarium">
                    <h1 className="card__title">Your Dragonarium</h1>
                    <div className="dragonarium__info">
                        <LabelButton
                            label="Options"
                            imageName="gearButton"
                            tag="button"
                            type="button"
                            onClick={toggleOptionsDialog}
                        />
                        <LabelButton
                            label="Help"
                            imageName="questionmarkButton"
                            tag="button"
                            type="button"
                            onClick={toggleHelpDialog}
                        />
                    </div>
                    <div className="dragonarium__column">
                        <h2>Missing {missingDragons.length}</h2>
                        <div className="selector">
                            <input
                                className="dragonarium__search"
                                value={missingDragonsSearch}
                                onChange={(event) => {
                                    setMissingDragonsSearch(event.target.value)
                                }}
                                type="text"
                                placeholder="Search..."
                            />
                        </div>
                        <ul className="dragonarium__list">
                            {missingDragons.map((dragon) => (
                                <li
                                    className={`dragonarium__dragon ${
                                        dragon.userCanBreed &&
                                        'dragonarium__dragon--breedable'
                                    } ${
                                        dragon.hiddenBySearch &&
                                        'dragonarium__dragon--hidden'
                                    }`}
                                    key={dragon.name}
                                    onClick={() => addDragon(dragon)}
                                >
                                    <img
                                        loading="lazy"
                                        height="50"
                                        alt={`${dragon.name} Dragon Egg`}
                                        src={`https://namethategg.com/eggs/${transformToEggName(
                                            dragon.name
                                        )}.png`}
                                    />
                                    {dragon.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="dragonarium__column">
                        <h2>Acquired {userDragons.length}</h2>
                        <div className="selector">
                            <input
                                className="dragonarium__search"
                                value={userDragonsSearch}
                                onChange={(event) => {
                                    setUserDragonsSearch(event.target.value)
                                }}
                                type="text"
                                placeholder="Search..."
                            />
                        </div>

                        <ul className="dragonarium__list">
                            {userDragons.map((dragon) => (
                                <li
                                    className={`dragonarium__dragon ${
                                        dragon.hiddenBySearch &&
                                        'dragonarium__dragon--hidden'
                                    }`}
                                    key={dragon.name}
                                    onClick={() => removeDragon(dragon)}
                                >
                                    <img
                                        loading="lazy"
                                        height="50"
                                        alt={`${dragon.name} Dragon Egg`}
                                        src={`https://namethategg.com/eggs/${transformToEggName(
                                            dragon.name
                                        )}.png`}
                                    />
                                    {dragon.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
                <section className="card">
                    <h2 className="card__title">Information</h2>
                    <p>
                        The Dragonarium makes managing your DragonVale
                        collection easier and more organized. This tool helps
                        you keep track of the dragons you have already acquired
                        and identifies which dragons you can currently breed.
                    </p>

                    <p>
                        Simply add your collected dragons to the "Acquired"
                        section. The "Missing" section will then automatically
                        update, sorting and highlighting in green the dragons
                        you can breed with your existing collection. This
                        ensures you always know which dragons are within reach.
                    </p>
                    <p>
                        The data is saved in the browser's local storage.
                        Therefore, the data will be "stored" even if you
                        close/refresh the tab or restart the computer. The only
                        way to lose the data, as far as I'm aware, is if you
                        clear your cookies or switch to another browser. This
                        way of storage also means it is unfortunately impossible
                        to share data between browsers or devices
                        (desktop/mobile).
                    </p>
                    <p>
                        Click on the "Help" button for detailed instructions on
                        how to use the DragonVale Dragonarium effectively.
                    </p>
                </section>
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
                            src="/xButton.png"
                        />
                    </button>
                    <div className="dialog__content">
                        <p>Quickly add or remove all dragons</p>
                        <div className="row">
                            <button
                                onClick={() => {
                                    setUserDragons(allDragons)
                                    setMissingDragons([])
                                }}
                                className="button button--wide"
                            >
                                Add all
                            </button>
                            <button
                                onClick={() => {
                                    setUserDragons([])
                                    setMissingDragons(allDragons)
                                }}
                                className="button button--wide button--red"
                            >
                                Remove all
                            </button>
                        </div>
                        <p>Quickly add all permanent dragons by element</p>
                        <button
                            onClick={() => addPermanentDragons('*')}
                            className="button button--wide"
                        >
                            Add from all elements
                        </button>
                        <div className="dragonarium__element-section">
                            {regularElements.map((element) => (
                                <button
                                    key={element}
                                    className="dragonarium__element"
                                    onClick={() => addPermanentDragons(element)}
                                >
                                    <img
                                        src={`/elementIcons/${element}_1.webp`}
                                    ></img>
                                </button>
                            ))}
                        </div>
                        <p>Quickly add all epic dragons by element</p>
                        <button
                            onClick={() => addEpicDragons('*')}
                            className="button button--wide"
                        >
                            Add from all elements
                        </button>
                        <div className="dragonarium__element-section">
                            {epicElements.map((element) => (
                                <button
                                    key={element}
                                    className="dragonarium__element"
                                    onClick={() => addEpicDragons(element)}
                                >
                                    <img
                                        src={`/elementIcons/${element}_1.webp`}
                                    ></img>
                                </button>
                            ))}
                        </div>
                    </div>
                </dialog>
                <dialog
                    id="helpDialog"
                    className="dialog"
                >
                    <button
                        aria-label="Close dialog"
                        className="dialog__closeButton"
                        type="button"
                        onClick={toggleHelpDialog}
                    >
                        <img
                            width="60"
                            height="60"
                            src="/xButton.png"
                        />
                    </button>
                    <div className="dialog__content">
                        <p>
                            To toggle an egg between the missing and the
                            acquired section, simply click it.
                        </p>
                        <p>
                            If you want to move multiple eggs, open the options
                            menu and press either the add buttons, the remove
                            button or the elements to add dragons by element.
                        </p>
                        <p>
                            If you need to add or remove a specific dragon from
                            a pist, you can use the search functionality.
                        </p>
                    </div>
                </dialog>
            </main>
        </>
    )
}
