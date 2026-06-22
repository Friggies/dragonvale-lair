import React from 'react'
import Tool from './Tool'
import { Metadata } from 'next'
import dragons from '@/data/dragons.json'
import Section from '@/components/Section/Section'

export const metadata: Metadata = {
    title: 'Dragonarium - The DragonVale Lair',
    description:
        'Easily manage your DragonVale collection with the Dragonarium tool. Track acquired dragons, discover breedable ones, and organize your progress.',
}

export default function Dragonarium() {
    return (
        <main className="main">
            <Section
                title="Your Dragonarium"
                className="dragonarium"
                isH1
            >
                <Tool dragons={dragons} />
            </Section>
            <Section title="Information">
                <p>
                    The Dragonarium makes managing your DragonVale collection
                    easier and more organized. This tool helps you keep track of
                    the dragons you have already acquired and identifies which
                    dragons you can currently breed.
                </p>
                <p>
                    Simply add your collected dragons to the "Acquired" section.
                    The "Missing" section will then automatically update,
                    sorting and highlighting in green the dragons you can breed
                    with your existing collection. This ensures you always know
                    which dragons are within reach.
                </p>
                <p>
                    This data is also used on the{' '}
                    <a
                        className="link"
                        href="/parent-finder"
                    >
                        Parent Finder
                    </a>{' '}
                    if you toggle "All Combos" to "Your Combos". The Compendium
                    has a limit on how many combos it returns, so it might not
                    return combos that you have, and therefore it might look
                    like you don't have any possible combinations for the target
                    dragon, even though you have.
                </p>
                <p>
                    The data is saved in the browser's local storage. Therefore,
                    the data will be "stored" even if you close/refresh the tab
                    or restart the computer. You can also use the copy/paste
                    import and export tools in the options menu to transfer
                    your acquired dragons between browsers or devices.
                </p>
                <p>
                    Click on the "Help" button for detailed instructions on how
                    to use the DragonVale Dragonarium effectively.
                </p>
            </Section>
        </main>
    )
}
