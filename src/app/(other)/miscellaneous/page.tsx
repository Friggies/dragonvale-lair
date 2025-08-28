import LabelButton from '@/components/LabelButton'
import Row from '@/components/Row/Row'
import Section from '@/components/Section/Section'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'The DragonVale Lair Miscellaneous',
    description: 'More features and tools to ease your DragonVale experience.',
}

export default async function Page() {
    return (
        <main className="main">
            <Section
                title="Miscellaneous"
                isH1
            >
                <Row>
                    <LabelButton
                        label="Homepage"
                        link="/"
                        imageName="buildingButton"
                    />
                    <LabelButton
                        label="Feedback & Ideas"
                        link="/feedback"
                        imageName="starButton"
                    />
                    <LabelButton
                        label="Soundtrack"
                        link="https://aubreyhodges.bandcamp.com/album/dragonvale-soundtrack-collection"
                        imageName="soundtrackButton"
                    />
                </Row>
                <Row>
                    <LabelButton
                        label="DC Farming"
                        link="/farming"
                        imageName="farmingButton"
                    />
                    <LabelButton
                        label="Anniversary Contest"
                        link="/eggy-hatchy"
                        imageName="eggyHatchyButton"
                    />
                    <LabelButton
                        label="Name That Egg"
                        link="/name-that-egg"
                        imageName="eggButton"
                    />
                </Row>
                <Row>
                    <LabelButton
                        label="Reddit"
                        link="https://www.reddit.com/r/dragonvale/"
                        imageName="redditButton"
                    />
                    <LabelButton
                        label="Forum"
                        link="https://dragonvale-tips.proboards.com/"
                        imageName="communityButton"
                    />
                    <LabelButton
                        label="Discord"
                        link="https://discord.com/invite/dragonvale"
                        imageName="discordButton"
                    />
                </Row>
            </Section>
        </main>
    )
}
