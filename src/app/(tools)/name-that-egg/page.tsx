import { Metadata } from 'next'
import Section from '@/components/Section/Section'

export const metadata: Metadata = {
    title: 'Name That Egg - The DragonVale Lair',
    description: '',
}

export default function NameThatEgg() {
    return (
        <main className="main">
            <Section
                title="Name That Egg"
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
