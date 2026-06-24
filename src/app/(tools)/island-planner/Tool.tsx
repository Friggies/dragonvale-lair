'use client'

import { DragEvent, MouseEvent, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import LabelInput from '@/components/LabelInput'
import styles from './Tool.module.scss'

type IslandType = 'standard' | 'gargantuan' | 'lost' | 'rift'
type PresetCategory = 'Habitat' | 'Building' | 'Custom'
type CurrencyType = 'dc' | 'etherium' | 'gem' | 'treats' | 'dynamic'
type HabitatSizeData = [
    variant: string,
    width: number,
    height: number,
    dragonCapacity: number,
    currencyCapacity?: number,
    currencyType?: CurrencyType,
]

interface IslandConfig {
    name: string
    columns: number
    rows: number
    bottomScreenRow?: number
    blockedCells: Set<string>
    regions?: IslandRegion[]
}

interface IslandRegion {
    name: string
    x: number
    y: number
    width: number
    height: number
}

interface Preset {
    id: string
    name: string
    variant: string
    category: PresetCategory
    width: number
    height: number
    color: string
    dragonCapacity?: number
    currencyCapacity?: number
    currencyType?: CurrencyType
}

interface PlacedItem extends Preset {
    instanceId: string
    x: number
    y: number
}

interface DragOffset {
    x: number
    y: number
}

interface HabitatSize {
    variant: string
    width: number
    height: number
    dragonCapacity: number
    currencyCapacity?: number
    currencyType?: CurrencyType
}

interface HabitatPreset {
    name: string
    sizes: HabitatSize[]
}

const standardBlockedCells = makeBlockedCells(26, [
    [6, 4],
    [5, 3],
    [4, 2],
    [3, 2],
    [2, 1],
    [1, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
])

const riftOriginalGridSize = 60
const riftInactiveStripSize = 2
const riftExpansionStripSize = 28
const riftExpansionStart = riftOriginalGridSize + riftInactiveStripSize
const riftExpandedGridSize = riftExpansionStart + riftExpansionStripSize
const riftBlockedCells = makeRiftBlockedCells(
    riftOriginalGridSize,
    riftInactiveStripSize
)

const islandConfigs: Record<IslandType, IslandConfig> = {
    standard: {
        name: 'Standard Island',
        columns: 26,
        rows: 28,
        bottomScreenRow: 28,
        blockedCells: standardBlockedCells,
    },
    gargantuan: {
        name: 'Gargantuan Island',
        columns: 40,
        rows: 40,
        bottomScreenRow: 40,
        blockedCells: new Set(),
    },
    lost: {
        name: 'Lost Island',
        columns: 15,
        rows: 15,
        bottomScreenRow: 15,
        blockedCells: new Set(),
    },
    rift: {
        name: 'Rift Dimension',
        columns: riftExpandedGridSize,
        rows: riftExpandedGridSize,
        blockedCells: riftBlockedCells,
        regions: [
            {
                name: 'Original Rift Grid',
                x: 0,
                y: 0,
                width: riftOriginalGridSize,
                height: riftOriginalGridSize,
            },
            {
                name: 'Expanded Strip',
                x: riftExpansionStart,
                y: 0,
                width: riftExpansionStripSize,
                height: riftExpansionStart,
            },
            {
                name: 'Expanded Strip',
                x: 0,
                y: riftExpansionStart,
                width: riftExpansionStart,
                height: riftExpansionStripSize,
            },
            {
                name: 'Expanded Corner',
                x: riftExpansionStart,
                y: riftExpansionStart,
                width: riftExpansionStripSize,
                height: riftExpansionStripSize,
            },
        ],
    },
}

const habitatPresets: HabitatPreset[] = [
    {
        name: 'Air',
        sizes: sizes(
            ['Regular', 4, 4, 2, 6000],
            ['Large', 5, 5, 4, 10000],
            ['Giant', 6, 6, 5, 100000]
        ),
    },
    {
        name: 'Apocalypse',
        sizes: sizes(
            ['Regular', 5, 5, 2, 750000],
            ['Large', 7, 7, 4, 1250000],
            ['Giant', 8, 8, 6, 3000000]
        ),
    },
    {
        name: 'Aura',
        sizes: sizes(
            ['Regular', 6, 6, 5, 1250000],
            ['Large', 7, 7, 6, 1500000],
            ['Giant', 8, 8, 8, 2000000]
        ),
    },
    { name: 'Aquarium', sizes: sizes(['Regular', 15, 15, 9, 5000000]) },
    {
        name: "Bahamut's Basilica",
        sizes: sizes(['Regular', 7, 7, 1, 25000, 'treats']),
    },
    { name: 'Celestial', sizes: sizes(['Regular', 6, 6, 6, 2750000]) },
    {
        name: 'Chrysalis',
        sizes: sizes(
            ['Regular', 5, 5, 5, 1000000],
            ['Large', 7, 7, 6, 1500000],
            ['Giant', 8, 8, 7, 2000000]
        ),
    },
    {
        name: 'Cold',
        sizes: sizes(
            ['Regular', 5, 5, 1, 15000],
            ['Large', 6, 6, 3, 50000],
            ['Giant', 7, 7, 5, 100000]
        ),
    },
    { name: 'Crystalline', sizes: sizes(['Regular', 5, 5, 4, 4, 'gem']) },
    {
        name: 'Dark',
        sizes: sizes(
            ['Regular', 3, 3, 2, 50000],
            ['Large', 5, 5, 4, 100000],
            ['Giant', 6, 6, 5, 175000]
        ),
    },
    {
        name: 'Dark Reward',
        sizes: sizes(
            ['Regular', 3, 3, 1, 100000],
            ['Large', 4, 4, 3, 200000],
            ['Giant', 5, 5, 5, 350000]
        ),
    },
    {
        name: 'Dream',
        sizes: sizes(
            ['Regular', 5, 5, 2, 1250000],
            ['Large', 6, 6, 4, 1500000]
        ),
    },
    {
        name: 'Earth',
        sizes: sizes(
            ['Regular', 5, 5, 1, 10000],
            ['Large', 6, 6, 3, 75000],
            ['Giant', 7, 7, 5, 150000]
        ),
    },
    {
        name: 'Fire',
        sizes: sizes(
            ['Regular', 3, 3, 2, 7500],
            ['Large', 5, 5, 4, 15000],
            ['Giant', 6, 6, 5, 75000]
        ),
    },
    { name: 'Gemstone', sizes: sizes(['Regular', 4, 4, 2, 3, 'gem']) },
    {
        name: 'Gemstone Reward',
        sizes: sizes(['Regular', 4, 4, 2, 3, 'gem']),
    },
    { name: 'Harmonious', sizes: sizes(['Regular', 6, 6, 6, 1750000]) },
    { name: 'Hidden', sizes: sizes(['Regular', 6, 6, 6, 1250000]) },
    {
        name: 'Light',
        sizes: sizes(
            ['Regular', 3, 3, 2, 35000],
            ['Large', 5, 5, 4, 75000],
            ['Giant', 6, 6, 5, 125000]
        ),
    },
    {
        name: 'Light Reward',
        sizes: sizes(
            ['Regular', 3, 3, 1, 75000],
            ['Large', 4, 4, 3, 150000],
            ['Giant', 5, 5, 5, 250000]
        ),
    },
    {
        name: 'Lightning',
        sizes: sizes(
            ['Regular', 3, 3, 2, 1250],
            ['Large', 5, 5, 4, 2500],
            ['Giant', 6, 5, 5, 50000]
        ),
    },
    {
        name: 'Melody',
        sizes: sizes(
            ['Regular', 3, 3, 3, 1250000],
            ['Large', 4, 4, 4, 1500000],
            ['Giant', 6, 6, 6, 1750000]
        ),
    },
    { name: 'Meridiem', sizes: sizes(['Regular', 6, 6, 6, 2750000]) },
    {
        name: 'Metal',
        sizes: sizes(
            ['Regular', 4, 4, 2, 25000],
            ['Large', 6, 6, 4, 125000],
            ['Giant', 7, 7, 5, 200000]
        ),
    },
    {
        name: 'Monolith',
        sizes: sizes(
            ['Regular', 6, 6, 4, 1250000],
            ['Large', 7, 7, 5, 1750000]
        ),
    },
    {
        name: 'Monolith Reward',
        sizes: sizes(
            ['Regular', 6, 6, 4, 1250000],
            ['Large', 7, 7, 5, 1750000]
        ),
    },
    {
        name: 'Moon',
        sizes: sizes(
            ['Regular', 3, 3, 1, 750000],
            ['Large', 6, 6, 3, 1250000],
            ['Giant', 8, 8, 5, 1250000]
        ),
    },
    {
        name: 'Olympus',
        sizes: sizes(
            ['Regular', 5, 5, 3, 500000],
            ['Large', 7, 7, 4, 1250000],
            ['Giant', 8, 8, 5, 2000000]
        ),
    },
    {
        name: 'Olympus Reward',
        sizes: sizes(['Regular', 8, 8, 6, 2750000]),
    },
    {
        name: 'Omnitat',
        sizes: sizes(
            ['Regular', 5, 5, 5, 1750000],
            ['Large', 6, 6, 7, 2650000]
        ),
    },
    { name: 'Omnitat: Tower', sizes: sizes(['Regular', 6, 6, 4, 1250000]) },
    { name: 'Ornamental', sizes: sizes(['Regular', 6, 6, 5, 1000000]) },
    {
        name: 'Paradise',
        sizes: sizes(
            ['Regular', 5, 5, 4, 125000],
            ['Large', 5, 5, 5, 250000],
            ['Giant', 6, 6, 6, 500000]
        ),
    },
    {
        name: 'Plant',
        sizes: sizes(
            ['Regular', 3, 3, 2, 200],
            ['Large', 4, 4, 4, 500],
            ['Giant', 6, 6, 5, 50000]
        ),
    },
    {
        name: 'Rainbow',
        sizes: sizes(
            ['Regular', 2, 2, 1, 1000000],
            ['Large', 6, 6, 2, 1500000],
            ['Giant', 7, 7, 3, 2000000]
        ),
    },
    {
        name: 'Rift',
        sizes: sizes(
            ['Regular', 3, 3, 2, 6000],
            ['Large', 4, 4, 4, 10000],
            ['Giant', 6, 6, 5, 100000]
        ),
    },
    {
        name: 'Rift Habitat',
        sizes: sizes(
            ['Regular', 2, 2, 1, 30, 'etherium'],
            ['Reputable', 3, 3, 2, 65, 'etherium'],
            ['Revitalized', 4, 4, 3, 100, 'etherium'],
            ['Refined', 5, 5, 4, 135, 'etherium'],
            ['Regal', 6, 6, 5, 200, 'etherium']
        ),
    },
    {
        name: 'Seasonal',
        sizes: sizes(['Regular', 5, 5, 3, 750000], ['Large', 8, 8, 5, 1250000]),
    },
    {
        name: 'Snowflake',
        sizes: sizes(
            ['Regular', 6, 6, 4, 1000000],
            ['Large', 7, 7, 5, 1500000]
        ),
    },
    {
        name: 'Snowflake Reward',
        sizes: sizes(
            ['Regular', 6, 6, 4, 1000000],
            ['Large', 7, 7, 5, 1500000]
        ),
    },
    { name: 'Spooky', sizes: sizes(['Regular', 5, 5, 4, 500000]) },
    {
        name: 'Sun',
        sizes: sizes(
            ['Regular', 3, 3, 1, 750000],
            ['Large', 6, 6, 3, 1250000],
            ['Giant', 8, 8, 5, 2500000]
        ),
    },
    {
        name: 'Surface',
        sizes: sizes(
            ['Regular', 5, 5, 3, 1000000],
            ['Large', 5, 5, 4, 1750000],
            ['Giant', 6, 6, 6, 2000000]
        ),
    },
    {
        name: "Tiamat's Lair",
        sizes: sizes(['Regular', 7, 7, 1, 25000, 'treats']),
    },
    {
        name: 'Treasure',
        sizes: sizes(
            ['Regular', 6, 6, 2, 1000000],
            ['Large', 7, 7, 4, 2000000],
            ['Giant', 8, 8, 5, 3500000]
        ),
    },
    {
        name: 'Valedrasil',
        sizes: sizes(
            ['Regular', 3, 3, 3, 750000],
            ['Large', 4, 4, 4, 1100000],
            ['Giant', 5, 5, 6, 1500000]
        ),
    },
    {
        name: 'Vault of Abundance',
        sizes: sizes(['Regular', 6, 6, 1, undefined, 'dynamic']),
    },
    {
        name: 'Water',
        sizes: sizes(
            ['Regular', 3, 3, 2, 15000],
            ['Large', 5, 5, 4, 30000],
            ['Giant', 7, 7, 5, 100000]
        ),
    },
    { name: 'Wonderland', sizes: sizes(['Regular', 6, 6, 5, 4000000]) },
    {
        name: 'Zodiac',
        sizes: sizes(
            ['Regular', 6, 6, 3, 1250000],
            ['Large', 7, 7, 4, 1500000],
            ['Giant', 8, 8, 6, 1750000]
        ),
    },
]

const buildingPresets: Preset[] = [
    makePreset('Magic Portal', 'Portal', 'Building', 3, 3),
    makePreset('Signboard Portal', 'Portal', 'Building', 3, 3),
    makePreset('Breeding Cave', 'Building', 'Building', 5, 5),
    makePreset('Enchanted Breeding Cave', 'Building', 'Building', 5, 5),
    makePreset('Nursery', 'Building', 'Building', 4, 4),
    makePreset('Legendary Nursery', 'Building', 'Building', 4, 4),
    makePreset('Hibernation Cave', 'Building', 'Building', 4, 4),
    makePreset('Storage Tower', 'Building', 'Building', 4, 4),
    makePreset('Treat Farm', 'Regular', 'Building', 3, 3),
    makePreset('Large Treat Farm', 'Large', 'Building', 4, 4),
    makePreset('Huge Treat Farm', 'Large', 'Building', 5, 5),
    makePreset('Boost Building', 'Building', 'Building', 3, 3),
    makePreset('Generator', 'Building', 'Building', 3, 3),
    makePreset('Shrine', 'Building', 'Building', 3, 3),
    makePreset('Colosseum', 'Building', 'Building', 6, 6),
]

const presets = [
    ...habitatPresets.flatMap((habitat) =>
        habitat.sizes.map((size) =>
            makePreset(
                habitat.name,
                size.variant,
                'Habitat',
                size.width,
                size.height,
                {
                    dragonCapacity: size.dragonCapacity,
                    currencyCapacity: size.currencyCapacity,
                    currencyType: size.currencyType,
                }
            )
        )
    ),
    ...buildingPresets,
]

function sizes(...values: HabitatSizeData[]): HabitatSize[] {
    return values.map(
        ([variant, width, height, dragonCapacity, currencyCapacity, type]) => ({
            variant,
            width,
            height,
            dragonCapacity,
            currencyCapacity,
            currencyType:
                type ?? (currencyCapacity === undefined ? undefined : 'dc'),
        })
    )
}

function makeCellKey(x: number, y: number) {
    return `${x},${y}`
}

function parseCellKey(cellKey: string) {
    const [x, y] = cellKey.split(',').map(Number)

    return { x, y }
}

function makeBlockedCells(columns: number, rowBlockedEdges: number[][]) {
    const blockedCells = new Set<string>()

    rowBlockedEdges.forEach(([leftCount, rightCount], y) => {
        for (let x = 0; x < leftCount; x++) {
            blockedCells.add(makeCellKey(x, y))
        }

        for (let x = columns - rightCount; x < columns; x++) {
            blockedCells.add(makeCellKey(x, y))
        }
    })

    return blockedCells
}

function makeRiftBlockedCells(
    originalGridSize: number,
    inactiveStripSize: number
) {
    const blockedCells = new Set<string>()
    const inactiveEnd = originalGridSize + inactiveStripSize

    for (let y = 0; y < inactiveEnd; y++) {
        for (let x = originalGridSize; x < inactiveEnd; x++) {
            blockedCells.add(makeCellKey(x, y))
        }
    }

    for (let y = originalGridSize; y < inactiveEnd; y++) {
        for (let x = 0; x < inactiveEnd; x++) {
            blockedCells.add(makeCellKey(x, y))
        }
    }

    return blockedCells
}

function makePreset(
    name: string,
    variant: string,
    category: PresetCategory,
    width: number,
    height: number,
    metrics: Pick<
        Preset,
        'dragonCapacity' | 'currencyCapacity' | 'currencyType'
    > = {}
): Preset {
    const color =
        category === 'Habitat'
            ? getHabitatColor(metrics.currencyType)
            : '#8f6b2d'

    return {
        id: slugify(`${name}-${variant}-${width}x${height}`),
        name,
        variant,
        category,
        width,
        height,
        color,
        ...metrics,
    }
}

function getHabitatColor(currencyType?: CurrencyType) {
    if (currencyType === 'etherium') return '#7d4fc8'
    if (currencyType === 'gem') return '#2a8aa0'
    if (currencyType === 'treats') return '#a0622a'
    if (currencyType === 'dynamic') return '#4f75c8'

    return '#2d8f72'
}

function getCurrencyLabel(currencyType?: CurrencyType) {
    if (currencyType === 'etherium') return 'Etherium'
    if (currencyType === 'gem') return 'Gems'
    if (currencyType === 'treats') return 'Treats'
    if (currencyType === 'dynamic') return 'Varies'

    return 'DC'
}

function formatNumber(value: number) {
    return value.toLocaleString('en-US')
}

function formatPresetStats(preset: Preset) {
    const stats: string[] = []

    if (preset.dragonCapacity !== undefined) {
        stats.push(`${preset.dragonCapacity} dragons`)
    }

    if (preset.currencyCapacity !== undefined) {
        stats.push(
            `${formatNumber(preset.currencyCapacity)} ${getCurrencyLabel(
                preset.currencyType
            )}`
        )
    } else if (preset.currencyType === 'dynamic') {
        stats.push(getCurrencyLabel(preset.currencyType))
    }

    return stats.join(' / ')
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max)
}

function itemsOverlap(first: PlacedItem, second: PlacedItem) {
    return (
        first.x < second.x + second.width &&
        first.x + first.width > second.x &&
        first.y < second.y + second.height &&
        first.y + first.height > second.y
    )
}

function createInstanceId() {
    return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`
}

function canPlaceAt(
    preset: Preset,
    x: number,
    y: number,
    island: IslandConfig
) {
    if (
        x < 0 ||
        y < 0 ||
        x + preset.width > island.columns ||
        y + preset.height > island.rows
    ) {
        return false
    }

    for (let cellY = y; cellY < y + preset.height; cellY++) {
        for (let cellX = x; cellX < x + preset.width; cellX++) {
            if (island.blockedCells.has(makeCellKey(cellX, cellY))) {
                return false
            }
        }
    }

    return true
}

function findNearestValidPosition(
    preset: Preset,
    preferredX: number,
    preferredY: number,
    island: IslandConfig
) {
    const clampedX = clamp(
        preferredX,
        0,
        Math.max(0, island.columns - preset.width)
    )
    const clampedY = clamp(
        preferredY,
        0,
        Math.max(0, island.rows - preset.height)
    )

    if (canPlaceAt(preset, clampedX, clampedY, island)) {
        return { x: clampedX, y: clampedY }
    }

    let nearestPosition: { x: number; y: number } | null = null
    let nearestDistance = Infinity

    for (let y = 0; y <= island.rows - preset.height; y++) {
        for (let x = 0; x <= island.columns - preset.width; x++) {
            if (!canPlaceAt(preset, x, y, island)) continue

            const distance = Math.abs(x - clampedX) + Math.abs(y - clampedY)
            if (distance < nearestDistance) {
                nearestDistance = distance
                nearestPosition = { x, y }
            }
        }
    }

    return nearestPosition
}

function getPlacedTotals(placedItems: PlacedItem[]) {
    return placedItems.reduce(
        (totals, item) => {
            totals.dragonCapacity += item.dragonCapacity ?? 0

            if (item.currencyType === 'etherium') {
                totals.etheriumCapacity += item.currencyCapacity ?? 0
            } else if (item.currencyType === 'dc' || !item.currencyType) {
                totals.dcCapacity += item.currencyCapacity ?? 0
            }

            return totals
        },
        {
            dragonCapacity: 0,
            dcCapacity: 0,
            etheriumCapacity: 0,
        }
    )
}

export default function Tool() {
    const [islandType, setIslandType] = useState<IslandType>('standard')
    const [selectedPresetId, setSelectedPresetId] = useState(presets[0].id)
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
    const [placedItems, setPlacedItems] = useState<PlacedItem[]>([])
    const [search, setSearch] = useState('')
    const [customName, setCustomName] = useState('Custom')
    const [customWidth, setCustomWidth] = useState(4)
    const [customHeight, setCustomHeight] = useState(4)

    const island = islandConfigs[islandType]
    const selectedPreset =
        presets.find((preset) => preset.id === selectedPresetId) ?? presets[0]
    const selectedItem = placedItems.find(
        (item) => item.instanceId === selectedItemId
    )
    const displayedSelection = selectedItem ?? selectedPreset
    const displayedSelectionStats = formatPresetStats(displayedSelection)
    const placedTotals = useMemo(
        () => getPlacedTotals(placedItems),
        [placedItems]
    )

    const customPreset: Preset = {
        id: 'custom',
        name: customName.trim() || 'Custom',
        variant: 'Custom',
        category: 'Custom',
        width: clamp(customWidth, 1, island.columns),
        height: clamp(customHeight, 1, island.rows),
        color: '#6d50a7',
    }

    const filteredPresets = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) return presets

        return presets.filter((preset) =>
            [
                preset.name,
                preset.variant,
                preset.category,
                `${preset.width}x${preset.height}`,
                String(preset.dragonCapacity ?? ''),
                String(preset.currencyCapacity ?? ''),
                getCurrencyLabel(preset.currencyType),
            ]
                .join(' ')
                .toLowerCase()
                .includes(normalizedSearch)
        )
    }, [search])

    const collidingItemIds = useMemo(() => {
        const ids = new Set<string>()

        placedItems.forEach((item, index) => {
            placedItems.slice(index + 1).forEach((otherItem) => {
                if (itemsOverlap(item, otherItem)) {
                    ids.add(item.instanceId)
                    ids.add(otherItem.instanceId)
                }
            })
        })

        return ids
    }, [placedItems])
    const blockedCells = useMemo(
        () => Array.from(island.blockedCells).map(parseCellKey),
        [island.blockedCells]
    )

    const getGridPosition = (event: MouseEvent | DragEvent) => {
        const grid = event.currentTarget as HTMLDivElement
        const rect = grid.getBoundingClientRect()
        const gridStyles = window.getComputedStyle(grid)
        const borderLeft = Number.parseFloat(gridStyles.borderLeftWidth) || 0
        const borderTop = Number.parseFloat(gridStyles.borderTopWidth) || 0
        const cellWidth = grid.clientWidth / island.columns
        const cellHeight = grid.clientHeight / island.rows
        const x = Math.floor(
            (event.clientX - rect.left - borderLeft) / cellWidth
        )
        const y = Math.floor(
            (event.clientY - rect.top - borderTop) / cellHeight
        )

        return {
            x: clamp(x, 0, island.columns - 1),
            y: clamp(y, 0, island.rows - 1),
        }
    }

    const getClampedPosition = (preset: Preset, x: number, y: number) => ({
        x: clamp(x, 0, Math.max(0, island.columns - preset.width)),
        y: clamp(y, 0, Math.max(0, island.rows - preset.height)),
    })

    const placePreset = (preset: Preset, x: number, y: number) => {
        const position = getClampedPosition(preset, x, y)

        if (!canPlaceAt(preset, position.x, position.y, island)) return

        const newItem: PlacedItem = {
            ...preset,
            ...position,
            instanceId: createInstanceId(),
        }

        setPlacedItems((prev) => [...prev, newItem])
        setSelectedItemId(newItem.instanceId)
    }

    const moveItem = (
        instanceId: string,
        x: number,
        y: number,
        dragOffset: DragOffset
    ) => {
        setPlacedItems((prev) =>
            prev.map((item) =>
                item.instanceId === instanceId
                    ? movePlacedItem(item, x - dragOffset.x, y - dragOffset.y)
                    : item
            )
        )
        setSelectedItemId(instanceId)
    }

    const movePlacedItem = (item: PlacedItem, x: number, y: number) => {
        const position = getClampedPosition(item, x, y)

        if (!canPlaceAt(item, position.x, position.y, island)) {
            return item
        }

        return {
            ...item,
            ...position,
        }
    }

    const handleGridClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target !== event.currentTarget) return

        const position = getGridPosition(event)
        placePreset(selectedPreset, position.x, position.y)
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()

        const position = getGridPosition(event)
        const presetId = event.dataTransfer.getData('preset-id')
        const itemId = event.dataTransfer.getData('item-id')
        const dragOffset: DragOffset = {
            x: Number(event.dataTransfer.getData('drag-offset-x')) || 0,
            y: Number(event.dataTransfer.getData('drag-offset-y')) || 0,
        }

        if (itemId) {
            moveItem(itemId, position.x, position.y, dragOffset)
            return
        }

        const preset =
            presetId === customPreset.id
                ? customPreset
                : presets.find((currentPreset) => currentPreset.id === presetId)

        if (preset) {
            placePreset(
                preset,
                position.x - dragOffset.x,
                position.y - dragOffset.y
            )
        }
    }

    const setDragOffset = (
        event: DragEvent<HTMLElement>,
        width: number,
        height: number
    ) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const cellWidth = rect.width / width
        const cellHeight = rect.height / height

        const offsetX = clamp(
            Math.floor((event.clientX - rect.left) / cellWidth),
            0,
            width - 1
        )
        const offsetY = clamp(
            Math.floor((event.clientY - rect.top) / cellHeight),
            0,
            height - 1
        )

        event.dataTransfer.setData('drag-offset-x', String(offsetX))
        event.dataTransfer.setData('drag-offset-y', String(offsetY))
    }

    const duplicateSelectedItem = () => {
        if (!selectedItem) return

        placePreset(
            selectedItem,
            selectedItem.x + selectedItem.width,
            selectedItem.y
        )
    }

    const deleteSelectedItem = () => {
        if (!selectedItem) return

        setPlacedItems((prev) =>
            prev.filter((item) => item.instanceId !== selectedItem.instanceId)
        )
        setSelectedItemId(null)
    }

    const clearPlanner = () => {
        setPlacedItems([])
        setSelectedItemId(null)
    }

    const selectCustomPreset = () => {
        placePreset(customPreset, 0, 0)
        setSelectedPresetId(presets[0].id)
    }

    return (
        <div className={styles.tool}>
            <aside className={styles.sidebar}>
                <LabelInput label="Island">
                    <select
                        id="islandType"
                        className="dropdown"
                        value={islandType}
                        onChange={(event) => {
                            const nextIslandType = event.target
                                .value as IslandType
                            const nextIsland = islandConfigs[nextIslandType]

                            setIslandType(nextIslandType)
                            setPlacedItems((prev) =>
                                prev.reduce<PlacedItem[]>((items, item) => {
                                    const position = findNearestValidPosition(
                                        item,
                                        item.x,
                                        item.y,
                                        nextIsland
                                    )

                                    if (!position) return items

                                    return [...items, { ...item, ...position }]
                                }, [])
                            )
                            setSelectedItemId(null)
                        }}
                    >
                        {Object.entries(islandConfigs).map(([key, config]) => (
                            <option
                                key={key}
                                value={key}
                            >
                                {config.name} ({config.columns}x{config.rows})
                            </option>
                        ))}
                    </select>
                </LabelInput>

                <LabelInput label="Draggable presets">
                    <div className="selector">
                        <input
                            id="presetSearch"
                            className={styles.textInput}
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Plant, Large, Portal, 5x5..."
                            type="search"
                        />
                    </div>
                </LabelInput>

                <div className={styles.presetList}>
                    {filteredPresets.map((preset) => (
                        <button
                            key={preset.id}
                            className={`selector ${styles.presetButton} ${
                                selectedPresetId === preset.id
                                    ? styles.presetButtonActive
                                    : ''
                            }`}
                            draggable
                            type="button"
                            onClick={() => setSelectedPresetId(preset.id)}
                            onDragStart={(event) => {
                                event.dataTransfer.setData(
                                    'preset-id',
                                    preset.id
                                )
                                setDragOffset(
                                    event,
                                    preset.width,
                                    preset.height
                                )
                            }}
                        >
                            <span className={styles.presetName}>
                                {preset.name}
                            </span>
                            <span className={styles.presetMeta}>
                                {preset.variant} {preset.width}x{preset.height}
                                {preset.dragonCapacity !== undefined
                                    ? ` - ${preset.dragonCapacity} dragons`
                                    : ''}
                            </span>
                        </button>
                    ))}
                </div>

                <details className={styles.customPanel}>
                    <summary className={styles.panelTitle}>Custom size</summary>
                    <div className="selector">
                        <input
                            className={styles.textInput}
                            value={customName}
                            onChange={(event) =>
                                setCustomName(event.target.value)
                            }
                            aria-label="Custom item name"
                        />
                    </div>
                    <div className={styles.customSizeRow}>
                        <div className="selector">
                            <input
                                className={styles.textInput}
                                value={customWidth}
                                min="1"
                                max={island.columns}
                                onChange={(event) =>
                                    setCustomWidth(
                                        Number(event.target.value) || 1
                                    )
                                }
                                aria-label="Custom width"
                                type="number"
                            />
                        </div>
                        <span>x</span>
                        <div className="selector">
                            <input
                                className={styles.textInput}
                                value={customHeight}
                                min="1"
                                max={island.rows}
                                onChange={(event) =>
                                    setCustomHeight(
                                        Number(event.target.value) || 1
                                    )
                                }
                                aria-label="Custom height"
                                type="number"
                            />
                        </div>
                    </div>
                    <button
                        className={`button button--wide ${styles.actionButton}`}
                        type="button"
                        draggable
                        onClick={selectCustomPreset}
                        onDragStart={(event) => {
                            event.dataTransfer.setData(
                                'preset-id',
                                customPreset.id
                            )
                            setDragOffset(
                                event,
                                customPreset.width,
                                customPreset.height
                            )
                        }}
                    >
                        Place custom {customPreset.width}x{customPreset.height}
                    </button>
                </details>
            </aside>

            <section className={styles.workspace}>
                <div className={styles.toolbar}>
                    <div>
                        Selected:{' '}
                        <strong>
                            {`${displayedSelection.name} ${displayedSelection.variant} ${displayedSelection.width}x${displayedSelection.height}`}
                        </strong>
                        {displayedSelectionStats ? (
                            <span className={styles.selectedStats}>
                                {' '}
                                ({displayedSelectionStats})
                            </span>
                        ) : null}
                    </div>
                    <div className={styles.toolbarActions}>
                        <button
                            className={`button ${styles.actionButton}`}
                            type="button"
                            disabled={!selectedItem}
                            onClick={duplicateSelectedItem}
                        >
                            Duplicate
                        </button>
                        <button
                            className={`button button--red ${styles.actionButton}`}
                            type="button"
                            disabled={!selectedItem}
                            onClick={deleteSelectedItem}
                        >
                            Delete
                        </button>
                        <button
                            className={`button button--red ${styles.actionButton}`}
                            type="button"
                            disabled={placedItems.length === 0}
                            onClick={clearPlanner}
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className={styles.totals}>
                    <span>
                        <strong>
                            {formatNumber(placedTotals.dragonCapacity)}
                        </strong>{' '}
                        dragon slots
                    </span>
                    {islandType === 'rift' ? (
                        <span>
                            <strong>
                                {formatNumber(placedTotals.etheriumCapacity)}
                            </strong>{' '}
                            Etherium cap
                        </span>
                    ) : (
                        <span>
                            <strong>
                                {formatNumber(placedTotals.dcCapacity)}
                            </strong>{' '}
                            DC cap
                        </span>
                    )}
                </div>

                <div className={styles.boardScroller}>
                    <div
                        className={styles.grid}
                        onClick={handleGridClick}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={handleDrop}
                        style={
                            {
                                '--columns': island.columns,
                                '--rows': island.rows,
                            } as CSSProperties
                        }
                    >
                        {island.regions?.map((region) => (
                            <div
                                key={`${region.name}-${region.x}-${region.y}`}
                                className={styles.region}
                                style={{
                                    left: `calc(${region.x} * var(--cell-size))`,
                                    top: `calc(${region.y} * var(--cell-size))`,
                                    width: `calc(${region.width} * var(--cell-size))`,
                                    height: `calc(${region.height} * var(--cell-size))`,
                                }}
                            >
                                <span>{region.name}</span>
                            </div>
                        ))}
                        {island.bottomScreenRow !== undefined ? (
                            <div
                                className={styles.screenBottom}
                                style={{
                                    top: `calc(${island.bottomScreenRow} * var(--cell-size) - 2px)`,
                                }}
                            >
                                <span>Bottom of screen</span>
                            </div>
                        ) : null}
                        {blockedCells.map((cell) => (
                            <div
                                key={`${cell.x}-${cell.y}`}
                                className={styles.blockedCell}
                                style={{
                                    left: `calc(${cell.x} * var(--cell-size))`,
                                    top: `calc(${cell.y} * var(--cell-size))`,
                                    width: 'var(--cell-size)',
                                    height: 'var(--cell-size)',
                                }}
                            />
                        ))}
                        {placedItems.map((item) => {
                            const itemStats = formatPresetStats(item)

                            return (
                                <button
                                    key={item.instanceId}
                                    className={`${styles.placedItem} ${
                                        selectedItemId === item.instanceId
                                            ? styles.placedItemSelected
                                            : ''
                                    } ${
                                        collidingItemIds.has(item.instanceId)
                                            ? styles.placedItemCollision
                                            : ''
                                    }`}
                                    draggable
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation()
                                        setSelectedItemId(item.instanceId)
                                    }}
                                    onDragStart={(event) => {
                                        event.dataTransfer.setData(
                                            'item-id',
                                            item.instanceId
                                        )
                                        setDragOffset(
                                            event,
                                            item.width,
                                            item.height
                                        )
                                    }}
                                    style={
                                        {
                                            left: `calc(${item.x} * var(--cell-size))`,
                                            top: `calc(${item.y} * var(--cell-size))`,
                                            width: `calc(${item.width} * var(--cell-size))`,
                                            height: `calc(${item.height} * var(--cell-size))`,
                                            '--item-color': item.color,
                                        } as CSSProperties
                                    }
                                    title={`${item.name} ${item.variant} ${
                                        item.width
                                    }x${item.height}${
                                        itemStats ? ` - ${itemStats}` : ''
                                    }`}
                                >
                                    <span>{item.name}</span>
                                    <small>
                                        {item.width}x{item.height}
                                    </small>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>
        </div>
    )
}
