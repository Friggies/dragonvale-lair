'use client'
import { useState, FormEvent } from 'react'
import LabelInput from '@/components/LabelInput'
import LabelButton from '@/components/LabelButton'
import Select from 'react-select'
import transformToEggName from '@/utils/transformToEggName'
import Dragon from '@/types/dragon'
import Option from '@/types/option'

interface ToolProps {
    options: Option[]
    dragons: Dragon[]
}

export default function Tool({ options, dragons }: ToolProps) {
    const [data, setData] = useState<Dragon | null>(null)
    const [selectedQuest, setSelectedQuest] = useState<Option | null>(null)

    const submitForm = async (e: FormEvent) => {
        e.preventDefault()

        if (!selectedQuest) return

        const dragon = dragons.find(
            (dragon) => dragon.quest === selectedQuest.value
        )

        fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/quest-matcher', {
            method: 'POST',
        }).catch((error) => {
            alert(error)
        })

        setData(dragon ?? null)
    }

    const toggleHelpDialog = () => {
        const dialog = document.querySelector<HTMLDialogElement>('#helpDialog')
        if (dialog) dialog.open ? dialog.close() : dialog.showModal()
    }

    return (
        <>
            <form onSubmit={submitForm}>
                <div className="row">
                    <LabelInput label="Target Quest">
                        <Select
                            className="selector"
                            classNamePrefix="selector"
                            inputId="targetDragon"
                            id="selectTargetDragon"
                            instanceId="targetDragon"
                            required
                            unstyled
                            options={options}
                            value={selectedQuest} // Controlled component
                            onChange={setSelectedQuest} // Set the selected value
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
            {data ? (
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
            ) : (
                <p>Please choose a target quest and press "Get Dragon".</p>
            )}
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
                        alt="Close"
                    />
                </button>
                <div className="dialog__content">
                    <p>
                        Select a target quest from the dropdown and press "Get
                        Dragon".
                    </p>
                    <p>
                        The results show the dragon best suited for the target
                        quest.
                    </p>
                </div>
            </dialog>
        </>
    )
}
