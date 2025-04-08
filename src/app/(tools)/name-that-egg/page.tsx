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
                <p>
                    The Quest Matcher makes completing quests in DragonVale more
                    strategic and rewarding. The DragonVale Quest Matcher
                    assists you by identifying the best dragon for any given
                    quest.
                </p>
                <p>
                    Select your target quest and press the "Match" button. The
                    DragonVale Quest Matcher then gives you the optimal dragon
                    for the quest. This ensures that you always send the right
                    dragon, maximizing your chances of great quest rewards.
                </p>
                <p>
                    The DragonVale Quest Matcher is continually updated to
                    ensure it provides the most accurate and reliable dragon
                    recommendations.
                </p>
                <p>
                    Click on the "Help" button for detailed instructions on how
                    to use the DragonVale Quest Matcher effectively.
                </p>
            </Section>
        </main>
    )
}
