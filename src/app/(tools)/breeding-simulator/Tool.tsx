'use client'
import waitingTexts from '@/utils/waitingTexts'
import { useEffect, useState, FormEvent } from 'react'
import LabelInput from '@/components/LabelInput'
import LabelButton from '@/components/LabelButton'
import Select from 'react-select'
import transformToEggName from '@/utils/transformToEggName'
import Dragon from '@/types/dragon'
import Option from '@/types/option'

interface ToolProps {
    dragons: Dragon[]
}

// A valid result row returned from the API:
// [dragonName, percent, incubationTime, reducedTime?]
type BreedingResultRow = [string, string, string, string?]

// The API response can either be an array of valid result rows,
// or an error object with an error message.
type BreedingSimulatorResponse = BreedingResultRow[] | { error: string }

interface BreedingSimulatorFormData {
    dragon1: string
    dragon2: string
    beb: string
    cave: string
    time: string
    weather: string
    sort: string
    own: string
    target?: string
}

type IncubationMode = 'standard' | 'reduced' | 'runic'

export default function Tool({ dragons }: ToolProps) {
    // Initialize state with an empty array of valid rows.
    // Later this state may be set to an error object.
    const [data, setData] = useState<BreedingSimulatorResponse>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingText, setLoadingText] = useState<string>('')
    const [incubationMode, setIncubationMode] =
        useState<IncubationMode>('standard')

    const submitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)

        const selectedDragons = document.querySelectorAll(
            '.selector__single-value'
        ) as NodeListOf<HTMLElement>

        const formData: BreedingSimulatorFormData = {
            dragon1: selectedDragons[0].innerText,
            dragon2: selectedDragons[1].innerText,
            beb: (document.querySelector('#beb') as HTMLSelectElement).value,
            cave: (document.querySelector('#cave') as HTMLSelectElement).value,
            time: (document.querySelector('#time') as HTMLSelectElement).value,
            weather: (document.querySelector('#weather') as HTMLSelectElement)
                .value,
            sort: (document.querySelector('#sort') as HTMLSelectElement).value,
            own: (document.querySelector('#own') as HTMLSelectElement).value,
            target: selectedDragons[2]?.innerText,
        }

        fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/breeding-simulator', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data: BreedingSimulatorResponse) => {
                setData(data)
                setLoading(false)
            })
            .catch((error: Error) => {
                console.error(error)
                setLoading(false)
            })
    }

    useEffect(() => {
        const dialog = document.querySelector(
            '#loadingDialog'
        ) as HTMLDialogElement
        if (loading) {
            dialog.showModal()
        } else {
            dialog.close()
            setLoadingText(
                waitingTexts[Math.floor(Math.random() * waitingTexts.length)]
            )
        }
    }, [loading])

    const toggleOptionsDialog = (): void => {
        const dialog = document.querySelector(
            '#optionsDialog'
        ) as HTMLDialogElement
        if (dialog.open) {
            dialog.close()
        } else {
            dialog.showModal()
        }
    }

    const toggleHelpDialog = (): void => {
        const dialog = document.querySelector(
            '#helpDialog'
        ) as HTMLDialogElement
        if (dialog.open) {
            dialog.close()
        } else {
            dialog.showModal()
        }
    }

    const toggleIncubationTime = (): void => {
        setIncubationMode((prevMode) => {
            if (prevMode === 'standard') return 'reduced'
            if (prevMode === 'reduced') return 'runic'
            return 'standard'
        })
    }

    // Create options from dragons, excluding certain rarities and elements.
    const options: Option[] = dragons
        .filter(
            (dragon) =>
                !(
                    dragon.rarity.includes('Legendary') ||
                    dragon.rarity.includes('Mythic') ||
                    dragon.rarity.includes('Gemstone') ||
                    dragon.elements.includes('Crystalline')
                )
        )
        .map((dragon) => ({
            value: dragon.name,
            label: dragon.name,
        }))

    options.sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0))

    const reduceTimeToRunic = (timeStr: string): string => {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number)
        const totalSeconds = hours * 3600 + minutes * 60 + seconds
        const reducedSeconds = Math.floor(totalSeconds * 0.25)
        const newHours = Math.floor(reducedSeconds / 3600)
        const newMinutes = Math.floor((reducedSeconds % 3600) / 60)
        const newSeconds = reducedSeconds % 60
        return [
            newHours.toString(),
            String(newMinutes).padStart(2, '0'),
            String(newSeconds).padStart(2, '0'),
        ].join(':')
    }

    return (
        <>
            <form onSubmit={submitForm}>
                <div className="row row--toColumn">
                    <LabelInput label="Dragon 1:">
                        <Select
                            className="selector"
                            classNamePrefix="selector"
                            inputId="dragon1"
                            id="selectDragon1"
                            instanceId="dragon1"
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
                            incubationMode === 'standard'
                                ? 'Standard Cave'
                                : incubationMode === 'reduced'
                                ? 'Upgraded Cave'
                                : 'Runic Cave'
                        }
                        imageName={
                            incubationMode === 'standard'
                                ? 'breedingCave'
                                : incubationMode === 'reduced'
                                ? 'enhancedBreedingCave'
                                : 'runicBreedingCave'
                        }
                        tag="button"
                        type="button"
                        onClick={toggleIncubationTime}
                    />
                </div>
            </form>
            {/* Check if data is an array to render the table;
          otherwise, if it's an error object, show the error message. */}
            {Array.isArray(data) && data.length > 0 ? (
                <table className="dragonGrid">
                    <tbody className="dragonGrid__body">
                        {data.map((row, index) => (
                            <tr
                                key={index}
                                className="dragonPreview"
                            >
                                <td>
                                    <img
                                        loading="lazy"
                                        height="50"
                                        alt={`${row[0]} Dragon Egg`}
                                        src={`https://namethategg.com/eggs/${transformToEggName(
                                            row[0]
                                        )}.png`}
                                    />
                                </td>
                                <td>{row[0]}</td>
                                <td>{row[1]}</td>
                                <td className="dragonPreview__incubation">
                                    {incubationMode === 'standard'
                                        ? row[2]
                                        : incubationMode === 'reduced'
                                        ? row[3] || row[2]
                                        : reduceTimeToRunic(row[2])}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : typeof data === 'object' && 'error' in data ? (
                <p>Error: {data.error}</p>
            ) : (
                <p>Please select two dragons to proceed.</p>
            )}
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
                        src="/buttons/xButton.png"
                    />
                </button>
                <div className="dialog__content">
                    <div className="row row--toColumn">
                        <LabelInput label="Bring Em Back">
                            <select
                                id="beb"
                                className="dropdown"
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </LabelInput>
                        <LabelInput label="Cave">
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
                        <LabelInput label="Time">
                            <select
                                id="time"
                                className="dropdown"
                            >
                                <option value="Day">Day</option>
                                <option value="Night">Night</option>
                            </select>
                        </LabelInput>
                        <LabelInput label="Weather">
                            <select
                                id="weather"
                                className="dropdown"
                            >
                                <option value="None">None</option>
                                <option value="Bats">Bats</option>
                                <option value="Blossoms">Blossoms</option>
                                <option value="Butterflies">Butterflies</option>
                                <option value="Confetti">Confetti</option>
                                <option value="Dandelions">Dandelions</option>
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
                        <LabelInput label="Target Dragon">
                            <Select
                                className="selector"
                                classNamePrefix="selector"
                                inputId="targetDragon"
                                id="selectTargetDragon"
                                instanceId="targetDragon"
                                required
                                unstyled
                                isClearable
                                options={options}
                            />
                        </LabelInput>
                        <LabelInput label="Target Dragon Owned">
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
                        <LabelInput label="Sort">
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
                        src="/buttons/xButton.png"
                    />
                </button>
                <div className="dialog__content">
                    <p>
                        Select two dragons from the dropdowns and press
                        "Simulate".
                    </p>
                    <p>
                        You can tweak specific options if you find it necessary.
                    </p>
                    <p>
                        A list of the potential dragons you can get with the
                        selected combination of parent dragons will be
                        generated. This list complies with the given options.
                    </p>
                </div>
            </dialog>
        </>
    )
}
