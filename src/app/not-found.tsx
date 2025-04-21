import LabelButton from '@/components/LabelButton'
import Row from '@/components/Row/Row'
import Section from '@/components/Section/Section'

export default function NotFound() {
    return (
        <main className="main">
            <Section title="Page not found">
                <p>
                    The page you are looking for does not seem to exist. It
                    might have been moved, renamed, or simply stolen by a bunch
                    of Dargon Dragons.
                </p>
                <Row>
                    <LabelButton
                        label="Simulator"
                        link="/breeding-simulator"
                        imageName="heartButton"
                    />
                    <LabelButton
                        label="Parent Finder"
                        link="/parent-finder"
                        imageName="loupeButton"
                    />
                    <LabelButton
                        label="Dragonarium"
                        link="/dragonarium"
                        imageName="dragonariumButton"
                    />
                </Row>
            </Section>
        </main>
    )
}
