import waitingTexts from '@/utils/waitingTexts'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import LabelInput from '@/components/LabelInput'
import LabelButton from '@/components/LabelButton'
import Select from 'react-select'
import dragons from '/public/dragons.json'
import transformToEggName from '@/utils/transformToEggName'

export default function Home() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')
    const [standardIncubation, setStandardIncubation] = useState(true)

    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)

        const selectedDragons = document.querySelectorAll(
            '.selector__single-value'
        )
        const formData = {
            dragon1: selectedDragons[0].innerText,
            dragon2: selectedDragons[1].innerText,
            beb: document.querySelector('#beb').value,
            cave: document.querySelector('#cave').value,
            time: document.querySelector('#time').value,
            weather: document.querySelector('#weather').value,
            sort: document.querySelector('#sort').value,
            own: document.querySelector('#own').value,
            target: selectedDragons[2]?.innerText,
        }

        fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/breeding-simulator', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data)
                setLoading(false)
            })
            .catch((error) => {
                console.error(error)
                setLoading(false)
            })
    }

    useEffect(() => {
        const dialog = document.querySelector('#loadingDialog')
        if (loading === true) {
            dialog.showModal()
        } else {
            dialog.close()
            setLoadingText(
                waitingTexts[Math.floor(Math.random() * waitingTexts.length)]
            )
        }
    }, [loading])

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
    const toggleIncubationTime = () => {
        document
            .querySelector('.dragonGrid')
            .classList.toggle('dragonGrid--reducedIncubationTimes')
        setStandardIncubation((prev) => {
            return !prev
        })
    }

    const options = dragons.map((dragon) => {
        if (dragon.rarity.includes('Legendary')) return {}
        if (dragon.rarity.includes('Mythic')) return {}
        if (dragon.rarity.includes('Gemstone')) return {}
        if (dragon.elements.includes('Crystalline')) return {}
        return {
            value: dragon.name,
            label: dragon.name,
        }
    })
    options.sort((a, b) => {
        if (a.label < b.label) {
            return -1
        }
        if (a.label > b.label) {
            return 1
        }
        return 0
    })

    return (
        <>
            <Head>
                <title>
                    DragonVale Breeding Simulator - The DragonVale Lair
                </title>
                <meta
                    name="description"
                    content="Check what dragon results are possible for a specific breeding combination in DragonVale with the DragonVale Breeding Simulator. Just select two dragons and hit the simulate button."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">Breeding Simulator</h1>
                    <form onSubmit={submitForm}>
                        <div className="row row--toColumn">
                            <LabelInput label="Dragon 1:">
                                <Select
                                    className="selector"
                                    classNamePrefix="selector"
                                    inputId="dragon1"
                                    id="selectDragon1"
                                    instanceId="dragon1"
                                    type="text"
                                    required
                                    unstyled
                                    options={options}
                                />
                            </LabelInput>
                            <LabelInput label="Dragon 2:">
                                <Select
                                    className="selector"
                                    classNamePrefix="selector"
                                    inputId="dragon2"
                                    id="selectDragon2"
                                    instanceId="dragon2"
                                    type="text"
                                    required
                                    unstyled
                                    options={options}
                                />
                            </LabelInput>
                        </div>
                        <div className="row">
                            <LabelButton
                                label="Simulate"
                                imageName="heartButton"
                                tag="button"
                                type="submit"
                            />
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
                            <LabelButton
                                label={
                                    standardIncubation
                                        ? 'Standard Cave'
                                        : 'Upgraded Cave'
                                }
                                imageName={
                                    standardIncubation
                                        ? 'breedingCave'
                                        : 'enhancedBreedingCave'
                                }
                                tag="button"
                                type="button"
                                onClick={toggleIncubationTime}
                            />
                        </div>
                    </form>
                    {!data.length && (
                        <p>Please select two dragons to proceed.</p>
                    )}
                    <table className="dragonGrid">
                        <tbody className="dragonGrid__body">
                            {data.map((row, index) => (
                                <tr
                                    key={index}
                                    className="dragonPreview"
                                >
                                    <td>
                                        <img
                                            height="50"
                                            alt={`${row[0]} Dragon Egg`}
                                            src={`https://namethategg.com/eggs/${transformToEggName(
                                                row[0]
                                            )}.png`}
                                        />
                                    </td>
                                    <td>{row[0]}</td>
                                    <td>{row[1]}</td>
                                    <td className="dragonPreview__incubation dragonPreview__incubation--standard">
                                        {row[2]}
                                    </td>
                                    <td className="dragonPreview__incubation dragonPreview__incubation--reduced">
                                        {row[3]}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
                <section className="card">
                    <h2 className="card__title">Information</h2>
                    <p>
                        Check what dragon results are possible for a specific
                        breeding combination in DragonVale with the DragonVale
                        Breeding Simulator. Just select two dragons and hit the
                        "Simulate" button. It then uses the most updated data
                        from{' '}
                        <a
                            href="https://dragonvale-tips.proboards.com/thread/1393/dragonvale-compendium"
                            target="_blank"
                            className="link"
                        >
                            The DragonVale Compendium
                        </a>{' '}
                        to give a qualified guess. The DragonVale Breeding
                        Simulator can take some time to fetch the data from the
                        Google sheet, so please be patient.
                    </p>
                    <p>
                        You can switch between the breeding caves to correctly
                        show your incubation time. The upgraded cave reduces
                        incubation by 20%. Additional options like Bring Em
                        Back, Weather, and Time are available under the
                        "Options" menu to fine-tune your breeding conditions.
                    </p>
                    <p>
                        Simulate breedings with the DragonVale Breeding
                        Simulator and save time, resources, and precious gems in
                        DragonVale. No more guesswork or trial and error - The
                        DragonVale Breeding Simulator empowers you to make
                        informed decisions and achieve your dragon-breeding
                        goals efficiently.
                    </p>
                    <p>
                        Click on the "Help" button for detailed instructions on
                        how to use the DragonVale Breeding Simulator
                        effectively.
                    </p>
                </section>
                <dialog
                    id="loadingDialog"
                    className="dialog"
                >
                    <div className="dialog__content">
                        <div className="lds-roller">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <p>{loadingText}</p>
                        <p>Please wait!</p>
                    </div>
                </dialog>
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
                        <div className="row row--toColumn">
                            <LabelInput>
                                Bring Em Back
                                <select
                                    id="beb"
                                    className="dropdown"
                                >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </LabelInput>
                            <LabelInput>
                                Cave
                                <select
                                    id="cave"
                                    className="dropdown"
                                >
                                    <option value="Normal">Normal</option>
                                    <option value="Rift">Rift</option>
                                    <option value="Social">Social</option>
                                </select>
                            </LabelInput>
                        </div>
                        <div className="row row--toColumn">
                            <LabelInput>
                                Time
                                <select
                                    id="time"
                                    className="dropdown"
                                >
                                    <option value="Day">Day</option>
                                    <option value="Night">Night</option>
                                </select>
                            </LabelInput>
                            <LabelInput>
                                Weather
                                <select
                                    id="weather"
                                    className="dropdown"
                                >
                                    <option value="None">None</option>
                                    <option value="Bats">Bats</option>
                                    <option value="Blossoms">Blossoms</option>
                                    <option value="Butterflies">
                                        Butterflies
                                    </option>
                                    <option value="Confetti">Confetti</option>
                                    <option value="Dandelions">
                                        Dandelions
                                    </option>
                                    <option value="Sunny">Sunny</option>
                                    <option value="Fireflies">Fireflies</option>
                                    <option value="Ghosts">Ghosts</option>
                                    <option value="Leaves">Leaves</option>
                                    <option value="Rain">Rain</option>
                                    <option value="Rainbows">Rainbows</option>
                                    <option value="Shooting Stars">
                                        Shooting Stars
                                    </option>
                                    <option value="Snow">Snow</option>
                                    <option value="Storm">Storm</option>
                                </select>
                            </LabelInput>
                        </div>
                        <div className="row row--toColumn">
                            <LabelInput>
                                Target Dragon
                                <Select
                                    className="selector"
                                    classNamePrefix="selector"
                                    inputId="targetDragon"
                                    id="selectTargetDragon"
                                    instanceId="targetDragon"
                                    type="text"
                                    required
                                    unstyled
                                    isClearable
                                    options={options}
                                />
                            </LabelInput>
                            <LabelInput>
                                Target Dragon Owned
                                <select
                                    id="own"
                                    className="dropdown"
                                >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                </select>
                            </LabelInput>
                        </div>
                        <div className="row row--toColumn">
                            <LabelInput>
                                Sort
                                <select
                                    id="sort"
                                    className="dropdown"
                                >
                                    <option value="TimeAsc">
                                        Ascending Incubation Time
                                    </option>
                                    <option value="TimeDesc">
                                        Descending Incubation Time
                                    </option>
                                    <option value="ChanceDesc">
                                        Descending Chance
                                    </option>
                                </select>
                            </LabelInput>
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
                            Select two dragons from the dropdowns and press
                            "Simulate".
                        </p>
                        <p>
                            You can tweak specific options if you find it
                            necessary.
                        </p>
                        <p>
                            A list of the potential dragons you can get with the
                            selected combination of parent dragons will be
                            generated. This list complies with the given
                            options.
                        </p>
                    </div>
                </dialog>
            </main>
        </>
    )
}
