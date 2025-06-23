import React from 'react'
import Tool from './Tool'
import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import dragons from '@/data/dragons.json'
import regularElements from '@/data/regularElements'
import epicElements from '@/data/epicElements'
import Dragon from '@/types/dragon'

export const metadata: Metadata = {
    title: 'DC Farming - The DragonVale Lair',
    description:
        'An interactive overview of what levels are needed to reach Dragoncash earning rate roundings for each dragon.',
}

// Non-reactive processing of dragons data
function filterAndSortDragons() {
    const allDragons: Dragon[] = dragons.filter((dragon) => {
        if (dragon.rarity.includes('Legendary')) return false
        if (dragon.rarity.includes('Mythic')) return false
        if (dragon.rarity.includes('Gemstone')) return false
        if (dragon.elements.includes('Crystalline')) return false
        if (!dragon.income) return false
        return true
    })
    allDragons.sort((a, b) => a.income! - b.income!)
    return allDragons
}

const initialDragons = filterAndSortDragons()

export default function DCfarming() {
    return (
        <main className="main">
            <Section
                title="Dragoncash Farming"
                className="farming"
            >
                <Tool
                    initialDragons={initialDragons}
                    regularElements={regularElements}
                    epicElements={epicElements.filter(
                        (el) => el !== 'Crystalline' && el !== 'Gemstone'
                    )}
                />
            </Section>
            <Section title="Information">
                <p>
                    The Dragoncash (DC) Farming tool makes managing your
                    DragonVale park more efficient and profitable. The DC
                    Farming tool helps you identify the optimal dragon levels
                    needed to maximize your dragoncash earnings.
                </p>
                <p>
                    Select your active boosts and generators in the "Active
                    Boosts &amp; Generators" section. The DC Farming tool will
                    then dynamically update the table to show the specific
                    levels each dragon needs to reach key earning rate
                    roundings.
                </p>
                <p>
                    For detailed strategies and advanced tips, visit the{' '}
                    <a
                        className="link"
                        href="https://dragonvale-tips.proboards.com/thread/1411/dc-farming-guide"
                    >
                        DC Farming Guide
                    </a>
                    . This community resource offers more information to help
                    you make the most out of your DC Farm. There is also a{' '}
                    <a
                        className="link"
                        href="https://www.reddit.com/r/dragonvale/comments/1j9ae3p/early_game_dragoncash_farming_guide_and_dc_earner/"
                    >
                        guide for new players
                    </a>{' '}
                    that are just getting started.
                </p>
            </Section>
        </main>
    )
}
