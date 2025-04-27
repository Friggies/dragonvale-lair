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
                <p>
                    Eggy Hatchy is a DragonVale event minigame. This replica
                    tries to mimic most of the functionality of the minigame,
                    but it does have a few discrepancies.
                </p>
                <p>
                    <a
                        href="https://dragonvale-tips.proboards.com/thread/1802/eggy-hatchy-guide"
                        className="link"
                        target="_blank"
                    >
                        You can find a guide to the real minigame here
                    </a>
                    , but this version does not have stages or towers with
                    different difficulties. All the boards generate in the same
                    way. It also does not require tickets, so enjoy playing as
                    much as you want. The goal of the real minigame is to
                    complete stages to obtain the event currently, but the goal
                    of this replica is to score as many points as possible. You
                    gain points by baking eggs.
                </p>
                <p>
                    You must complete all the goals and bank all the eggs for
                    your game to complete. Anonymous players won't see their
                    game or score on the leaderboard, and users who play with
                    their Friend ID will only see their best score.
                </p>
                <p id="friendIdText">
                    You can find you Friend ID in the DragonVale app if you
                    press the Social button and then open your profile card.
                    Copy it by pressing the "Copy ID" button and paste it in the
                    input field above.
                </p>
                <p>
                    The merging and banking functions a lot like the real
                    minigame. You can bank any egg, and you can merge any egg
                    with the closest eggs to it on both axes. However, there is
                    no level restriction and there is no way to redo merges.
                </p>
                <p>
                    The merging does not use the compendium, and the breeding
                    odds and results are therefore a bit skewed from the in-game
                    breeding.
                </p>{' '}
            </Section>
        </main>
    )
}
