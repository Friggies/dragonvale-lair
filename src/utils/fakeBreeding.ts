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
    const parentA = DRAGONS.find((d) => d.name === parentNameA)
    const parentB = DRAGONS.find((d) => d.name === parentNameB)

    if (!parentA || !parentB) {
        console.error('One or both parent dragons not found.')
        return null
    }

    if (parentA === parentB) {
        return parentA
    }

    const parentNames = new Set<string>([parentA.name, parentB.name])
    const parentElements = new Set<string>([
        ...parentA.elements,
        ...parentB.elements,
    ])

    if (parentElements.has('Rainbow')) {
        for (const elem of RAINBOW_ELEMENTS) {
            parentElements.add(elem)
        }
    }

    const validCandidates: Dragon[] = DRAGONS.filter((candidate) => {
        if (!candidate.combo || candidate.combo.length === 0) return false
        if (parentNames.has(candidate.name)) return true
        if (
            candidate.availability === 'LIMITED' &&
            !currentlyAvailable.includes(candidate.name)
        ) {
            return false
        }
        const rarityLC = candidate.rarity.toLowerCase()
        if (
            rarityLC === 'legendary' ||
            rarityLC === 'primary' ||
            rarityLC === 'mythic'
        )
            return false

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

    // Count rarity types
    let gemstoneCount = 0
    let epicCount = 0
    let galaxyCount = 0
    let rareCount = 0
    let otherCount = 0

    validCandidates.forEach((c) => {
        const rarity = c.rarity.toLowerCase()
        if (rarity === 'gemstone') gemstoneCount++
        else if (rarity === 'epic') epicCount++
        else if (rarity === 'galaxy') galaxyCount++
        else if (rarity === 'rare') rareCount++
        else otherCount++
    })

    // Assign base weights
    const GEMSTONE_WEIGHT = 1
    const EPIC_WEIGHT = 1
    const GALAXY_WEIGHT = 1
    const RARE_WEIGHT = 5

    const fixedTotal =
        gemstoneCount * GEMSTONE_WEIGHT +
        epicCount * EPIC_WEIGHT +
        galaxyCount * GALAXY_WEIGHT +
        rareCount * RARE_WEIGHT

    const MIN_REMAINING = 1 // 1% reserved for others

    // If fixed exceeds 99%, scale it down to leave at least 1% left
    const availableForFixed = 100 - MIN_REMAINING
    const scaleFactor =
        fixedTotal + MIN_REMAINING > 100 ? availableForFixed / fixedTotal : 1

    const adjGem = GEMSTONE_WEIGHT * scaleFactor
    const adjEpic = EPIC_WEIGHT * scaleFactor
    const adjGalaxy = GALAXY_WEIGHT * scaleFactor
    const adjRare = RARE_WEIGHT * scaleFactor

    const totalUsed =
        gemstoneCount * adjGem +
        epicCount * adjEpic +
        galaxyCount * adjGalaxy +
        rareCount * adjRare

    const leftover = Math.max(0, 100 - totalUsed)
    const perOther = otherCount > 0 ? leftover / otherCount : 0

    // Build weighted candidate list
    const candidatesWithWeight: { candidate: Dragon; weight: number }[] = []
    for (const candidate of validCandidates) {
        const rarity = candidate.rarity.toLowerCase()
        let weight = 0
        if (rarity === 'gemstone') weight = adjGem
        else if (rarity === 'epic') weight = adjEpic
        else if (rarity === 'galaxy') weight = adjGalaxy
        else if (rarity === 'rare') weight = adjRare
        else weight = perOther

        candidatesWithWeight.push({ candidate, weight })
    }

    const selected = weightedRandom(
        candidatesWithWeight.map(({ candidate, weight }) => ({
            item: candidate,
            weight,
        }))
    )

    /* Optional: Debug log
     */
    const totalWeight = candidatesWithWeight.reduce(
        (sum, cw) => sum + cw.weight,
        0
    )

    /*
    let debugTotal = 0
    console.log('Dragon selection percentages:')
    candidatesWithWeight.forEach(({ candidate, weight }) => {
        const percentage = (weight / totalWeight) * 100
        debugTotal += percentage
        console.log(`${candidate.name}: ${percentage.toFixed(2)}%`)
    })
    console.log(`Total: ${debugTotal.toFixed(2)}%`)
    */

    return selected
}
