import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import dragons from '@/data/dragons.json'
import Tool from './Tool'

export const metadata: Metadata = {
    title: 'Eggy Hatchy - The DragonVale Lair',
    description: '',
}

export default function EggyHatchy() {
    return (
        <main className="main">
            <Section
                title="EggyHatchy"
                className="game"
                isH1
            >
                <Tool dragons={dragons} />
            </Section>
            <Section title="Information">
                <p></p>
            </Section>
        </main>
    )
}
