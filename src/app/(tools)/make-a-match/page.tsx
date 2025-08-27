import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import Tool from './Tool'
import Leaderboard from './Leaderboard'

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
            <Section title="Leaderboard">
                <Leaderboard />
            </Section>
            <Section title="Information">
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Tempore distinctio, pariatur vero rerum accusantium
                    laboriosam? Delectus excepturi recusandae quae
                    exercitationem inventore? Dolores fugit iste vero nam ut
                    illum totam explicabo!
                </p>
                <p id="friendIdText">
                    You can find you Friend ID in the DragonVale app if you
                    press the Social button and then open your profile card.
                    Copy it by pressing the "Copy ID" button and paste it in the
                    input field above.
                </p>
            </Section>
        </main>
    )
}
