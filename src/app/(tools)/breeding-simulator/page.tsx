import React from 'react'
import Tool from './Tool'
import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import dragons from '@/data/dragons.json'

export const metadata: Metadata = {
    title: 'Breeding Simulator - The DragonVale Lair',
    description:
        'Check what dragon results are possible for a specific breeding combination in DragonVale with the DragonVale Breeding Simulator tool. Just select two dragons and hit the simulate button.',
}

export default function BreedingSimulator() {
    return (
        <main className="main">
            <Section
                title="Breeding Simulator"
                isH1
            >
                <Tool dragons={dragons} />
            </Section>
            <Section title="Information">
                <p>
                    Check what dragon results are possible for a specific
                    breeding combination in DragonVale with the DragonVale
                    Breeding Simulator. Just select two dragons and hit the
                    "Simulate" button. It then uses the most updated data from{' '}
                    <a
                        href="https://dragonvale-tips.proboards.com/thread/1393/dragonvale-compendium"
                        target="_blank"
                        className="link"
                    >
                        The DragonVale Compendium
                    </a>{' '}
                    to give a qualified guess. The DragonVale Breeding Simulator
                    can take some time to fetch the data from the Google sheet,
                    so please be patient.
                </p>
                <p>
                    You can switch between the breeding caves to correctly show
                    your incubation time. The upgraded cave reduces incubation
                    by 20% and the runic cave reduces incubation time by 75%.
                    Additional options like Bring Em Back, Weather, and Time are
                    available under the "Options" menu to fine-tune your
                    breeding conditions.
                </p>
                <p>
                    Simulate breedings with the DragonVale Breeding Simulator
                    and save time, resources, and precious gems in DragonVale.
                    No more guesswork or trial and error - The DragonVale
                    Breeding Simulator empowers you to make informed decisions
                    and achieve your dragon-breeding goals efficiently.
                </p>
                <p>
                    Click on the "Help" button for detailed instructions on how
                    to use the DragonVale Breeding Simulator effectively.
                </p>
            </Section>
        </main>
    )
}
