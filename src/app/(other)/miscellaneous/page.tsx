import LabelButton from '@/components/LabelButton'
import Row from '@/components/Row/Row'
import Section from '@/components/Section/Section'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'The DragonVale Lair Statistics',
    description:
        'Statistics for The DragonVale Lair. Watch how many monthly requests each endpoint has received since the launch of The DragonVale Lair.',
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
                        label="Name That Egg"
                        link="https://namethategg.com/"
                        imageName="eggButton"
                    />
                    <LabelButton
                        label="DC Farming"
                        link="/farming"
                        imageName="farmingButton"
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
