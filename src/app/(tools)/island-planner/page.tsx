import Section from '@/components/Section/Section'
import { Metadata } from 'next'
import Tool from './Tool'

export const metadata: Metadata = {
    title: 'Island Planner - The DragonVale Lair',
    description:
        'Plan DragonVale island layouts with searchable habitat and building size presets.',
}

export default function IslandPlanner() {
    return (
        <main className="main">
            <Section
                title="Island Planner"
                className="islandPlanner"
                isH1
            >
                <Tool />
            </Section>
            <Section title="Information">
                <p>
                    Use the Island Planner to sketch habitat and building
                    layouts on either a standard island grid or a Gargantuan
                    Island grid. Select a preset and click the grid to place it,
                    or drag a preset from the list onto the grid.
                </p>
                <p>
                    The standard grid, Gargantuan grid, bottom-of-screen marker,
                    and habitat sizes are based on the{' '}
                    <a
                        className="link"
                        href="https://dragonvale.fandom.com/wiki/Standard_Islands"
                    >
                        Standard Islands
                    </a>{' '}
                    and{' '}
                    <a
                        className="link"
                        href="https://dragonvale.fandom.com/wiki/Gargantuan_Island"
                    >
                        Gargantuan Island
                    </a>{' '}
                    pages on the DragonVale Wiki.
                </p>
            </Section>
        </main>
    )
}
