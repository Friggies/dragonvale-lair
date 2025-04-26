import getMonthName from '@/utils/getMonthName'
import { Metadata } from 'next'
import supabase from '@/utils/supabaseClient'

export const metadata: Metadata = {
    title: 'The DragonVale Lair Statistics',
    description:
        'Statistics for The DragonVale Lair. Watch how many monthly requests each endpoint has received since the launch of The DragonVale Lair.',
}

export default async function Page() {
    const [
        { data: breedingSimulatorStatistics },
        { data: parentFinderStatistics },
        { data: questMatcherStatistics },
    ] = await Promise.all([
        supabase
            .from('breeding-simulator-statistics')
            .select('*')
            .order('yearMonth', { ascending: false }),
        supabase
            .from('parent-finder-statistics')
            .select('*')
            .order('yearMonth', { ascending: false }),
        supabase
            .from('quest-matcher-statistics')
            .select('*')
            .order('yearMonth', { ascending: false }),
    ])

    const renderStatistics = (
        statistics: { yearMonth: string; hits: number }[]
    ) => {
        if (!statistics || statistics.length === 0) {
            return <p>No data available.</p>
        }

        return statistics.map((stat) => {
            const hits = stat.hits - 1
            const isPlural = hits !== 1 ? 's' : ''
            const [year, month] = stat.yearMonth.split('-')

            return (
                <li key={stat.yearMonth}>
                    {`${getMonthName(
                        month
                    )} ${year}: ${hits} request${isPlural}`}
                </li>
            )
        })
    }

    return (
        <main className="main">
            <section className="card">
                <h1 className="card__title">Statistics</h1>

                <h2>Breeding Simulator</h2>
                <ol className="column">
                    {renderStatistics(breedingSimulatorStatistics || [])}
                </ol>

                <h2>Parent Finder</h2>
                <ol className="column">
                    {renderStatistics(parentFinderStatistics || [])}
                </ol>

                <h2>Quest Matcher</h2>
                <ol className="column">
                    {renderStatistics(questMatcherStatistics || [])}
                </ol>
            </section>
        </main>
    )
}
