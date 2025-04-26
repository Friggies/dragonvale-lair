import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import Tool from './Tool'
import Leaderboard from './Leaderboard'

export const metadata: Metadata = {
    title: 'Eggy Hatchy - The DragonVale Lair',
    description: '',
}

export default async function EggyHatchy() {
    return (
        <main className="main">
            <Section
                title="Eggy Hatchy"
                className="game"
                isH1
            >
                <Tool />
            </Section>
            <Section title="Leaderboard">
                <Leaderboard />
            </Section>
            <Section title="Information">
                <p></p>
            </Section>
        </main>
    )
}
