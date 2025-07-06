'use client'
import { useState, FormEvent } from 'react'
import LabelInput from '@/components/LabelInput'
import LabelButton from '@/components/LabelButton'
import Select, { GroupBase, SingleValue } from 'react-select'
import transformToEggName from '@/utils/transformToEggName'
import Dragon from '@/types/dragon'
import Option from '@/types/option'

interface ToolProps {
    options: Option[] // quest options
    dragons: Dragon[] // full dragon data
}

// extended option type to tag source
interface TaggedOption extends Option {
    tag: 'quest' | 'dragon'
}

type Result =
    | { type: 'quest'; dragon: Dragon }
    | { type: 'dragon'; quest: string }

export default function Tool({ options, dragons }: ToolProps) {
    const [selectedOption, setSelectedOption] = useState<TaggedOption | null>(
        null
    )
    const [result, setResult] = useState<Result | null>(null)

    // prepare dragon name options
    const dragonNameOptions: TaggedOption[] = dragons.map((d) => ({
        label: d.name + ' Dragon',
        value: d.name,
        tag: 'dragon',
    }))

    // tag quest options
    const questOptions: TaggedOption[] = options.map((o) => ({
        label: o.label,
        value: o.value,
        tag: 'quest',
    }))

    const groupedOptions: GroupBase<TaggedOption>[] = [
        { label: 'Quests', options: questOptions },
        { label: 'Dragons', options: dragonNameOptions },
    ]

    const submitForm = (e: FormEvent) => {
        e.preventDefault()
        if (!selectedOption) return

        if (selectedOption.tag === 'quest') {
            // find the dragon by quest value
            const dragon = dragons.find((d) => d.quest === selectedOption.value)
            if (dragon) {
                setResult({ type: 'quest', dragon })
            } else {
                setResult(null)
            }
        } else {
            // user selected a dragon name
            const dragon = dragons.find((d) => d.name === selectedOption.value)
            if (dragon) {
                setResult({ type: 'dragon', quest: dragon.quest })
            } else {
                setResult(null)
            }
        }
    }

    const toggleHelpDialog = () => {
        const dialog = document.querySelector<HTMLDialogElement>('#helpDialog')
        if (dialog) dialog.open ? dialog.close() : dialog.showModal()
    }

    return (
        <>
            <form onSubmit={submitForm}>
                <div className="row">
                    <LabelInput label="Select Quest or Dragon">
                        <Select<TaggedOption, false, GroupBase<TaggedOption>>
                            className="selector"
                            classNamePrefix="selector"
                            inputId="selectOption"
                            instanceId="selectOption"
                            options={groupedOptions}
                            value={selectedOption}
                            onChange={(opt) =>
                                setSelectedOption(opt as TaggedOption)
                            }
                            isClearable
                            unstyled
                            required
                            id="selectTargetDragon"
                            placeholder="Search quests or dragons..."
                        />
                    </LabelInput>
                </div>
                <div className="row">
                    <LabelButton
                        label="Get Result"
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

            <div className="result">
                {result ? (
                    result.type === 'quest' ? (
                        <>
                            <img
                                loading="lazy"
                                height={50}
                                alt={`${result.dragon.name} Dragon Egg`}
                                src={transformToEggName(result.dragon.name)}
                            />
                            <p>{result.dragon.name}</p>
                        </>
                    ) : (
                        <p>
                            Quest: <strong>{result.quest}</strong>
                        </p>
                    )
                ) : (
                    <p>Please select an option and click "Get Result".</p>
                )}
            </div>

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
                        width={60}
                        height={60}
                        src="/buttons/xButton.png"
                        alt="Close"
                    />
                </button>
                <div className="dialog__content">
                    <p>
                        Select either a quest or a dragon from the dropdown
                        above.
                    </p>
                    <p>
                        If you pick a quest, we will show you the corresponding
                        dragon egg and name. If you pick a dragon, we'll display
                        the quest it is associated with.
                    </p>
                </div>
            </dialog>
        </>
    )
}
