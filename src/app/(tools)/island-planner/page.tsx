import Section from '@/components/Section/Section'
import { Metadata } from 'next'
import Tool from './Tool'

export const metadata: Metadata = {
    title: 'Island Planner - The DragonVale Lair',
    description:
        'Plan DragonVale island layouts with searchable habitat and building size presets, including capacity totals.',
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
                    layouts on standard, Gargantuan, Lost Island, and Rift
                    Dimension grids. Select a preset and click the grid to place
                    it, or drag a preset from the list onto the grid.
                </p>
                <p>
                    The standard grid, Gargantuan grid, bottom-of-screen marker,
                    habitat sizes, and capacity data are based on the{' '}
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
                    </a>
                    {', '}
                    <a
                        className="link"
                        href="https://dragonvale.fandom.com/wiki/Habitats"
                    >
                        Habitats
                    </a>{' '}
                    and{' '}
                    <a
                        className="link"
                        href="https://dragonvale.fandom.com/wiki/Miasmic_Ether"
                    >
                        Miasmic Ether
                    </a>{' '}
                    pages on the DragonVale Wiki.
                </p>
            </Section>
        </main>
    )
}
