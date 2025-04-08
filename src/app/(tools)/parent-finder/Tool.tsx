'use client'
import waitingTexts from '@/utils/waitingTexts'
import Head from 'next/head'
import { useEffect, useState, FormEvent } from 'react'
import LabelInput from '@/components/LabelInput'
import LabelButton from '@/components/LabelButton'
import Select from 'react-select'
import dragons from '@/data/dragons.json'
import InformationString from '@/components/InformationString'
import transformToEggName from '@/utils/transformToEggName'
import Dragon from '@/types/dragon'
import Option from '@/types/option'

// Type alias for the expected API row.
// In this example, each valid row is a 2-tuple with:
// [concatenated parent names (e.g. "dragon1+dragon2"), percentage string]
// You can extend this if the shape evolves.
type ParentFinderRow = [string, string]

// The data from the API is either an array of rows or the literal string "NODATA".
type DataState = ParentFinderRow[] | 'NODATA'

export default function Tool(): JSX.Element {
    const [data, setData] = useState<DataState>([])
    const [informationString, setInformationString] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingText, setLoadingText] = useState<string>('')
    const [userDragons, setUserDragons] = useState<Dragon[]>([])
    const [showUserCombos, setShowUserCombos] = useState<boolean>(false)

    const submitForm = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        setLoading(true)

        // Get selected elements from react-select.
        // The API assumes that the first element corresponds to targetDragon and
        // the second (if exists) to mustInclude.
        const selectedElements = document.querySelectorAll(
            '.selector__single-value'
        ) as NodeListOf<HTMLElement>
        const targetDragon = selectedElements[0]
        const mustInclude = selectedElements[1]

        const formData = {
            targetDragon: targetDragon.innerText,
            beb: (document.querySelector('#beb') as HTMLSelectElement).value,
            cave: (document.querySelector('#cave') as HTMLSelectElement).value,
            includeParent: (
                document.querySelector('#includeParent') as HTMLSelectElement
            ).value,
            mustInclude: mustInclude?.innerText,
        }

        fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/parent-finder', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((respData) => {
                // Assume API returns an array where the first element is either "NODATA" or valid data,
                // and the second element is an informational string.
                if (respData[0] === 'NODATA') {
                    setData('NODATA')
                } else {
                    setData(respData[0])
                }
                setInformationString(respData[1])
                setLoading(false)
            })
            .catch((error: Error) => {
                console.error(error)
                setLoading(false)
            })
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedDragons = localStorage.getItem('userDragons')
            if (storedDragons) {
                const userDragonsList = JSON.parse(storedDragons) as Dragon[]
                setUserDragons(userDragonsList)
            }
        }
    }, [])

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

    // Toggle between all combos and user-only combos
    const toggleComboView = (): void => {
        setShowUserCombos((prev) => !prev)
    }

    // Create react-select options.
    // Filter out dragons that should not appear (Legendary/Mythic) and then map.
    const options: Option[] = dragons
        .filter((dragon: Dragon) => {
            if (dragon.rarity.includes('Legendary')) return false
            if (dragon.rarity.includes('Mythic')) return false
            return true
        })
        .map((dragon: Dragon) => ({
            value: dragon.name,
            label: dragon.name,
        }))

    options.sort((a, b) => a.label.localeCompare(b.label))

    // Filter the data if showUserCombos is true.
    const filteredData: ParentFinderRow[] =
        data !== 'NODATA' && Array.isArray(data)
            ? showUserCombos
                ? data.filter((row: ParentFinderRow) => {
                      // row[0] is a string like "dragon1+dragon2"
                      const [parent1, parent2] = row[0].split('+')
                      const ownedParent1 = userDragons.some(
                          (dragon) => dragon.name === parent1
                      )
                      const ownedParent2 = userDragons.some(
                          (dragon) => dragon.name === parent2
                      )
                      return ownedParent1 && ownedParent2
                  })
                : data
            : []

    return (
        <>
            <h1 className="card__title">Parent Finder</h1>
            <form onSubmit={submitForm}>
                <div className="row">
                    <LabelInput label="Target Dragon">
                        <Select
                            className="selector"
                            classNamePrefix="selector"
                            inputId="targetDragon"
                            id="selectTargetDragon"
                            instanceId="targetDragon"
                            required
                            unstyled
                            options={options}
                        />
                    </LabelInput>
                </div>
                <div className="row">
                    <LabelButton
                        label="Find"
                        imageName="loupeButton"
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
                        label={showUserCombos ? 'Your Combos' : 'All Combos'}
                        imageName={
                            showUserCombos
                                ? 'dragonariumButton'
                                : 'dragonsButton'
                        }
                        tag="button"
                        type="button"
                        onClick={toggleComboView}
                    />
                </div>
            </form>
            {Array.isArray(data) && data.length === 0 ? (
                <p>Please choose a target dragon and press "Find".</p>
            ) : (
                <>
                    {data === 'NODATA' && (
                        <strong>Not breedable with selected options!</strong>
                    )}
                    <InformationString string={informationString} />
                </>
            )}
            <table className="dragonGrid">
                <tbody className="dragonGrid__body">
                    {data !== 'NODATA' &&
                        filteredData.map(
                            (row: ParentFinderRow, index: number) => (
                                <tr
                                    key={index}
                                    className="dragonParents"
                                >
                                    <td className="dragonParents__eggs">
                                        <img
                                            loading="lazy"
                                            height="50"
                                            alt={`${
                                                row[0].split('+')[0]
                                            } Dragon Egg`}
                                            src={`https://namethategg.com/eggs/${transformToEggName(
                                                row[0].split('+')[0]
                                            )}.png`}
                                        />
                                        <img
                                            loading="lazy"
                                            height="50"
                                            alt={`${
                                                row[0].split('+')[1]
                                            } Dragon Egg`}
                                            src={`https://namethategg.com/eggs/${transformToEggName(
                                                row[0].split('+')[1]
                                            )}.png`}
                                        />
                                    </td>
                                    <td>{row[0].replace('+', ' + ')}</td>
                                    <td>{row[1]}</td>
                                </tr>
                            )
                        )}
                </tbody>
            </table>
            {showUserCombos && (
                <p>
                    <em>
                        Some combinations might be missing even if you own both
                        parent dragons.
                    </em>
                </p>
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
                        <LabelInput label="Must Include">
                            <Select
                                className="selector"
                                classNamePrefix="selector"
                                inputId="mustInclude"
                                id="selectMustInclude"
                                instanceId="mustInclude"
                                required
                                unstyled
                                isClearable
                                options={options}
                            />
                        </LabelInput>
                    </div>
                    <div className="row row--toColumn">
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
                        <LabelInput label="Include Parent">
                            <select
                                id="includeParent"
                                className="dropdown"
                            >
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
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
                        Select a target dragon from the dropdown and press
                        "Find".
                    </p>
                    <p>
                        You can tweak specific options if you find it necessary.
                    </p>
                    <p>
                        The results show a generic formula for breeding the
                        dragon on the left. It shows the odds of breeding and
                        cloning the target dragon on the right. The number in
                        parenthesis is the chance for cloning with both parents
                        being the target dragon.
                    </p>
                    <p>
                        It then shows a list of the potential parents for the
                        target dragon that comply with the given options.
                    </p>
                </div>
            </dialog>
        </>
    )
}
