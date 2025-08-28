import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import Tool from './Tool'

export const metadata: Metadata = {
    title: 'Make a Match - The DragonVale Lair',
    description:
        'Enjoy Make a Match, a free DragonVale event minigame replica with a global leaderboard. Match dragons and egggs, track high scores, and compete with friends using your Friend ID.',
}

export default async function EggyHatchy() {
    return (
        <main className="main">
            <Section
                title="Make a Match"
                className="make_a_match_game"
                isH1
            >
                <Tool />
            </Section>
            <Section title="Information">
                <p>
                    Click on any sand patch to reveal what's under it. Match
                    each <strong>dragon</strong> to its corresponding{' '}
                    <strong>egg</strong>.
                </p>
                <p>
                    Each time you reveal two dunes, your guess counter increases
                    by one. If the two revealed cards don't match, they'll flip
                    back after a short delay.
                </p>
                <p>
                    When all pairs are matched, you'll see your total guesses
                    and can try again.
                </p>
                <p>
                    Images of dragons are from the player Moose, who has been
                    kind enough to share them. Say thanks whenever you get to
                    meet them.
                </p>
            </Section>
        </main>
    )
}
