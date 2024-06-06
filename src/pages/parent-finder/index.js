import waitingTexts from '@/utils/waitingTexts'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import LabelInput from '../components/LabelInput'
import LabelButton from '../components/LabelButton'
import Select from 'react-select'
import dragons from '/public/dragons.json'
import InformationString from '../components/InformationString'

export default function Home() {
    const [data, setData] = useState([])
    const [informationString, setInformationString] = useState('')
    const [loading, setLoading] = useState(false)
    const [loadingText, setLoadingText] = useState('')

    const submitForm = (e) => {
        e.preventDefault()
        setLoading(true)

        const [targetDragon, mustInclude] = document.querySelectorAll(
            '.selector__single-value'
        )
        const formData = {
            targetDragon: targetDragon.innerText,
            beb: document.querySelector('#beb').value,
            cave: document.querySelector('#cave').value,
            includeParent: document.querySelector('#includeParent').value,
            mustInclude: mustInclude?.innerText,
        }

        fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/parent-finder', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data[0] === 'NODATA') {
                    setData('NODATA')
                } else {
                    setData(data[0])
                }
                setInformationString(data[1])
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

    const options = dragons.map((dragon) => {
        if (dragon.name.includes(', the Legendary')) return {}
        return {
            value: dragon.name,
            label: dragon.name,
        }
    })

    return (
        <>
            <Head>
                <title>DragonVale Parent Finder - The DragonVale Lair</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">Parent Finder</h1>
                    <form onSubmit={submitForm}>
                        <div className="row row--toColumn">
                            <LabelInput label="Target Dragon">
                                <Select
                                    className="selector"
                                    classNamePrefix="selector"
                                    inputId="targetDragon"
                                    id="selectTargetDragon"
                                    instanceId="targetDragon"
                                    type="text"
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
                        </div>
                    </form>
                    {data.length === 0 ? (
                        <p>Please choose a target dragon and press "Find".</p>
                    ) : (
                        <>
                            {data === 'NODATA' && (
                                <strong>
                                    Not breedable with selected options!
                                </strong>
                            )}
                            <InformationString string={informationString} />
                        </>
                    )}
                    <table className="dragonGrid">
                        <tbody className="dragonGrid__body">
                            {data !== 'NODATA' &&
                                data.map((row, index) => (
                                    <tr
                                        key={index}
                                        className="dragonParents"
                                    >
                                        <td className="dragonParents__eggs">
                                            <img
                                                height="50"
                                                alt={`${
                                                    row[0].split('+')[0]
                                                } Egg`}
                                                src={`https://namethategg.com/eggs/${row[0]
                                                    .split('+')[0]
                                                    .replace(
                                                        'LoveyDovey',
                                                        'Loveydovey'
                                                    )
                                                    .replace(
                                                        /\s\d+/g,
                                                        ''
                                                    )}.png`}
                                            />
                                            <img
                                                height="50"
                                                alt={`${
                                                    row[0].split('+')[1]
                                                } Egg`}
                                                src={`https://namethategg.com/eggs/${row[0]
                                                    .split('+')[1]
                                                    .replace(
                                                        'LoveyDovey',
                                                        'Loveydovey'
                                                    )
                                                    .replace(
                                                        /\s\d+/g,
                                                        ''
                                                    )}.png`}
                                            />
                                        </td>
                                        <td>{row[0].replace('+', ' + ')}</td>
                                        <td>{row[1]}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </section>
                <section className="card">
                    <h2 className="card__title">Information</h2>
                    <p>
                        The Parent Finder makes dragon breeding more efficient
                        and strategic. The DragonVale Parent Finder assists you
                        when you try to breed a specific dragon.
                    </p>
                    <p>
                        Select your target dragon and press the "Find" button.
                        The DragonVale Parent Finder then uses the most updated
                        data from{' '}
                        <a
                            href="https://dragonvale-tips.proboards.com/thread/1393/dragonvale-compendium"
                            target="_blank"
                            className="link"
                        >
                            The DragonVale Compendium
                        </a>{' '}
                        to give you the best parent combinations.
                    </p>
                    <p>
                        Modify your search with additional options under the
                        "Options" menu. You can customize your search by
                        selecting features like Bring Em Back, the cave type,
                        and whether the parents can be the same as the target
                        dragon. You can also specify if one of the parents must
                        be a particular dragon, allowing for precise results.
                    </p>
                    <p>
                        Using the Parent Finder in DragonVale is a great way to
                        save time and resources. It takes the guesswork out of
                        breeding and reduces the chances of failed attempts.
                        Plus, it provides you with the most accurate results
                        currently available.
                    </p>
                    <p>
                        Click on the "Help" button for detailed instructions on
                        how to use the DragonVale Parent Finder effectively.
                    </p>
                </section>
                <dialog
                    id="loadingDialog"
                    className="dialog"
                >
                    <div>
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
                    <div className="row row--toColumn">
                        <LabelInput>
                            <abbr title="Bring Em Back">BeB</abbr>
                            <select id="beb">
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </LabelInput>
                        <LabelInput>
                            Cave
                            <select id="cave">
                                <option value="Normal">Normal</option>
                                <option value="Rift">Rift</option>
                                <option value="Social">Social</option>
                            </select>
                        </LabelInput>
                    </div>
                    <div className="row row--toColumn">
                        <LabelInput>
                            Include Parent
                            <select id="includeParent">
                                <option value="No">No</option>
                                <option value="Yes">Yes</option>
                            </select>
                        </LabelInput>
                        <LabelInput>
                            Must Include
                            <Select
                                className="selector"
                                classNamePrefix="selector"
                                inputId="mustInclude"
                                id="selectMustInclude"
                                instanceId="mustInclude"
                                type="text"
                                required
                                unstyled
                                isClearable
                                options={options}
                            />
                        </LabelInput>
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
                    <p>TODO: Write "Help" pop up.</p>
                </dialog>
            </main>
        </>
    )
}
