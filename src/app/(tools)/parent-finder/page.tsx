import Section from '@/components/Section/Section'
import Tool from './Tool'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Parent Finder - The DragonVale Lair',
    description:
        'The Parent Finder tool makes dragon breeding more efficient and strategic. The DragonVale Parent Finder assists you when you try to breed a specific dragon.',
}

export default function ParentFinder() {
    return (
        <main className="main">
            <Section title="Parent Finder">
                <Tool />
            </Section>
            <Section title="Information">
                <p>
                    The Parent Finder makes dragon breeding more efficient and
                    strategic. The DragonVale Parent Finder assists you when you
                    try to breed a specific dragon.
                </p>
                <p>
                    Select your target dragon and press the "Find" button. The
                    DragonVale Parent Finder then uses the most updated data
                    from{' '}
                    <a
                        href="https://dragonvale-tips.proboards.com/thread/1393/dragonvale-compendium"
                        target="_blank"
                        className="link"
                    >
                        The DragonVale Compendium
                    </a>{' '}
                    to give you the best parent combinations.
                </p>
                <p>
                    Modify your search with additional options under the
                    "Options" menu. You can customize your search by selecting
                    features like Bring Em Back, the cave type, and whether the
                    parents can be the same as the target dragon. You can also
                    specify if one of the parents must be a particular dragon,
                    allowing for precise results.
                </p>
                <p>
                    It is also possible to show only combinations that you have
                    yourself. Press the "All Combos" button and toggle it to
                    "Your Combos". The results are filtered with the data from
                    your{' '}
                    <a
                        className="link"
                        href="/dragonarium"
                    >
                        Dragonarium
                    </a>
                    . The Compendium has a limit on how many combos it returns,
                    so it might not return combos that you have, and it might
                    look like you don't have any possible combinations for the
                    target dragon, even though you have.
                </p>
                <p>
                    Using the Parent Finder in DragonVale is a great way to save
                    time and resources. It takes the guesswork out of breeding
                    and reduces the chances of failed attempts. Plus, it
                    provides you with the most accurate results currently
                    available.
                </p>
                <p>
                    Click on the "Help" button for detailed instructions on how
                    to use the DragonVale Parent Finder effectively.
                </p>
            </Section>
        </main>
    )
}
