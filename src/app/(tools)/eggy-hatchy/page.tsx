import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import Tool from './Tool'

export const metadata: Metadata = {
    title: 'Eggy Hatchy - The DragonVale Lair',
    description: '',
}

export default function EggyHatchy() {
    return (
        <main className="main">
            <Section
                title="Eggy Hatchy"
                className="game"
                isH1
            >
                <div />
            </Section>
            <Section title="Information">
                <p></p>
            </Section>
        </main>
    )
}
