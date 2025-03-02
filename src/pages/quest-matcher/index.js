import Head from 'next/head'
import { useState } from 'react'
import LabelInput from '@/components/LabelInput'
import LabelButton from '@/components/LabelButton'
import Select from 'react-select'
import dragons from '/public/dragons.json'
import transformToEggName from '@/utils/transformToEggName'

export default function Home() {
    const [data, setData] = useState('')

    const submitForm = (e) => {
        e.preventDefault()

        const targetQuest = document.querySelector('.selector__single-value')
        const formData = {
            targetQuest: targetQuest.innerText,
        }

        fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/quest-matcher', {
            method: 'POST',
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                setData(data)
            })
            .catch((error) => {
                console.error(error)
            })
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
        if (dragon.quest === 'N/A') return {}
        return {
            value: dragon.quest,
            label: dragon.quest,
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
                <title>DragonVale Quest Matcher - The DragonVale Lair</title>
                <meta
                    name="description"
                    content="The Quest Matcher makes completing quests in DragonVale more strategic and rewarding. The DragonVale Quest Matcher assists you by identifying the best dragon for any given quest."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">Quest Matcher</h1>
                    <form onSubmit={submitForm}>
                        <div className="row">
                            <LabelInput label="Target Quest">
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
                                label="Get Dragon"
                                imageName="dragonButton"
                                tag="button"
                                type="submit"
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
                        <p>
                            Please choose a target quest and press "Get Dragon".
                        </p>
                    ) : (
                        <>
                            <img
                                loading="lazy"
                                height="50"
                                alt={`${data.name} Dragon Egg`}
                                src={`https://namethategg.com/eggs/${transformToEggName(
                                    data.name
                                )}.png`}
                            />
                            {data.name}
                        </>
                    )}
                </section>
                <section className="card">
                    <h2 className="card__title">Information</h2>
                    <p>
                        The Quest Matcher makes completing quests in DragonVale
                        more strategic and rewarding. The DragonVale Quest
                        Matcher assists you by identifying the best dragon for
                        any given quest.
                    </p>
                    <p>
                        Select your target quest and press the "Match" button.
                        The DragonVale Quest Matcher then gives you the optimal
                        dragon for the quest. This ensures that you always send
                        the right dragon, maximizing your chances of great quest
                        rewards.
                    </p>
                    <p>
                        The DragonVale Quest Matcher is continually updated to
                        ensure it provides the most accurate and reliable dragon
                        recommendations.
                    </p>
                    <p>
                        Click on the "Help" button for detailed instructions on
                        how to use the DragonVale Quest Matcher effectively.
                    </p>
                </section>
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
                            Select a target quest from the dropdown and press
                            "Get Dragon".
                        </p>
                        <p>
                            The results show the dragon best suited for the
                            target quest.
                        </p>
                    </div>
                </dialog>
            </main>
        </>
    )
}
