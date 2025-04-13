import DRAGONS from '@/data/dragons.json'
import Dragon from '@/types/dragon'
import RAINBOW_ELEMENTS from '@/data/regularElements'
import currentlyAvailable from '@/data/currentlyAvailableDragons'

// Helper function to check if a requirement is fulfilled.
function isRequirementFulfilled(
    req: string,
    parentNames: Set<string>,
    parentElements: Set<string>
): boolean {
    // Special handling for the "elements-4" requirement: fulfilled if the union
    // of parent's elements (counting unique values) is 4 or more.
    if (req === 'elements-4') {
        return parentElements.size >= 4
    }

    // For other requirements, if the first character is uppercase treat it as a dragon name.
    if (req[0] === req[0].toUpperCase()) {
        return parentNames.has(req)
    } else {
        // Otherwise, treat the requirement as an element.
        // If either parent has "Rainbow", that fulfills any element condition.
        if (parentElements.has('Rainbow')) return true
        // Compare in a case-insensitive manner.
        for (let elem of parentElements) {
            if (elem.toLowerCase() === req) return true
        }
        return false
    }
}

// Utility for weighted random selection.
function weightedRandom<T>(items: { item: T; weight: number }[]): T {
    const total = items.reduce((acc, cur) => acc + cur.weight, 0)
    let rand = Math.random() * total
    for (const { item, weight } of items) {
        if (rand < weight) return item
        rand -= weight
    }
    // Fallback (should not occur if weights are positive)
    return items[items.length - 1].item
}

// Main breeding function.
export default function breedDragon(
    parentNameA: string,
    parentNameB: string
): Dragon | null {
    // Find parent dragons by their names.
    const parentA = DRAGONS.find((d) => d.name === parentNameA)
    const parentB = DRAGONS.find((d) => d.name === parentNameB)

    if (!parentA || !parentB) {
        console.error('One or both parent dragons not found.')
        return null
    }

    // Create sets of parent names and parent elements.
    const parentNames = new Set<string>([parentA.name, parentB.name])
    const parentElements = new Set<string>([
        ...parentA.elements,
        ...parentB.elements,
    ])

    // If either parent has "Rainbow", add all rainbow elements.
    if (parentElements.has('Rainbow')) {
        for (const elem of RAINBOW_ELEMENTS) {
            parentElements.add(elem)
        }
    }

    // Filter candidate dragons.
    const validCandidates: Dragon[] = DRAGONS.filter((candidate) => {
        // Must have a defined and non-empty combo array.
        if (!candidate.combo || candidate.combo.length === 0) return false

        // If a candidate is LIMITED, it must be in the currentlyAvailable list.
        if (
            candidate.availability === 'LIMITED' &&
            !currentlyAvailable.includes(candidate.name)
        ) {
            return false
        }

        // Exclude outcomes of rarity "Legendary" or "Primary" (case-insensitive).
        const rarityLC = candidate.rarity.toLowerCase()
        if (rarityLC === 'legendary' || rarityLC === 'primary') return false

        // A candidate is valid if:
        // 1. One of the parent's name matches candidate name (self-breeding allowed), or
        // 2. Every requirement in candidate.combo is fulfilled by the parents.
        if (parentNames.has(candidate.name)) return true
        if (
            candidate.combo.every((req) =>
                isRequirementFulfilled(req, parentNames, parentElements)
            )
        ) {
            return true
        }
        return false
    })

    if (validCandidates.length === 0) {
        console.warn('No valid breeding outcomes found for this combo.')
        return null
    }

    // First, count candidates by rarity.
    let gemstoneCount = 0,
        epicCount = 0,
        rareCount = 0,
        hybridCount = 0
    validCandidates.forEach((candidate) => {
        const rarityLC = candidate.rarity.toLowerCase()
        if (rarityLC === 'gemstone') {
            gemstoneCount++
        } else if (rarityLC === 'epic') {
            epicCount++
        } else if (rarityLC === 'rare') {
            rareCount++
        } else {
            hybridCount++
        }
    })

    // Fixed chances per candidate type.
    const GEMSTONE_CHANCE = 1 // 1%
    const EPIC_CHANCE = 0.5 // 0.5%
    const RARE_CHANCE = 5 // 5%

    // Calculate total fixed chance.
    const totalFixedChance =
        gemstoneCount * GEMSTONE_CHANCE +
        epicCount * EPIC_CHANCE +
        rareCount * RARE_CHANCE

    // Remaining chance to be split among hybrids.
    const remainingChance = hybridCount > 0 ? 100 - totalFixedChance : 0

    // Assign weights for candidates.
    const candidatesWithWeight: { candidate: Dragon; weight: number }[] = []
    validCandidates.forEach((candidate) => {
        let weight = 0
        const rarityLC = candidate.rarity.toLowerCase()
        if (rarityLC === 'gemstone') {
            weight = GEMSTONE_CHANCE
        } else if (rarityLC === 'epic') {
            weight = EPIC_CHANCE
        } else if (rarityLC === 'rare') {
            weight = RARE_CHANCE
        } else {
            // Hybrid candidate gets an equal share of the remaining chance.
            weight = hybridCount > 0 ? remainingChance / hybridCount : 0
        }
        candidatesWithWeight.push({ candidate, weight })
    })

    // --- Log the breeding pool candidates with their computed weight and chance ---
    // Here, the weight for each candidate is its fixed percentage value.
    console.log('Breeding Pool:')
    candidatesWithWeight.forEach(({ candidate, weight }) => {
        console.log(
            `- ${candidate.name} (rarity: ${candidate.rarity}, chance: ${weight}%)`
        )
    })
    // --- End Logging ---

    // For weightedRandom, we use the weights (which sum to 100 if valid).
    const selected = weightedRandom(
        candidatesWithWeight.map((item) => ({
            item: item.candidate,
            weight: item.weight,
        }))
    )

    return selected
}

// Example usage:
// const result = breedDragon("Bakey", "Cupcake");
// if (result) {
//   console.log("Breeding outcome:", result.name);
// } else {
//   console.log("No valid breeding outcome.");
// }
