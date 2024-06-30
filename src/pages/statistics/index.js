import Head from 'next/head'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import getMonthName from '@/utils/getMonthName'

const supabaseUrl = 'https://evrjimpvbkritkiantsx.supabase.co'
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cmppbXB2YmtyaXRraWFudHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNjAxMDEsImV4cCI6MjAzNDgzNjEwMX0.kU029veAv9sk1klaML-e49jNAFq9US4bZHxCUPVcVKU'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Home() {
    const [breedingSimulatorStatistics, setBreedingSimulatorStatistics] =
        useState([])
    const [parentFinderStatistics, setParentFinderStatistics] = useState([])
    const [questMatcherStatistics, setQuestMatcherStatistics] = useState([])

    const getStatistics = async () => {
        let { data: breedingSimulatorStatistics } = await supabase
            .from('breeding-simulator-statistics')
            .select('*')

        let { data: parentFinderStatistics } = await supabase
            .from('parent-finder-statistics')
            .select('*')

        let { data: questMatcherStatistics } = await supabase
            .from('quest-matcher-statistics')
            .select('*')

        setBreedingSimulatorStatistics(breedingSimulatorStatistics)
        setParentFinderStatistics(parentFinderStatistics)
        setQuestMatcherStatistics(questMatcherStatistics)
    }

    useEffect(() => {
        getStatistics()
    }, [])

    return (
        <>
            <Head>
                <title>The DragonVale Lair Statistics</title>
                <meta
                    name="description"
                    content="Statistics for The DragonVale Lair. Watch how many monthly requests each endpoint has received since the launch of The DragonVale Lair."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">Statistics</h1>
                    <h2>Breeding Simulator</h2>
                    <ol className="column">
                        {breedingSimulatorStatistics.length === 0 ? (
                            <p>Loading...</p>
                        ) : (
                            breedingSimulatorStatistics.map((stat) => {
                                const isPlural = stat.hits !== 1 ? 's' : ''
                                const year = stat.yearMonth.split('-')[0]
                                const month = getMonthName(
                                    stat.yearMonth.split('-')[1]
                                )
                                return (
                                    <li>{`${month} ${year}: ${stat.hits} request${isPlural}`}</li>
                                )
                            })
                        )}
                    </ol>
                    <h2>Parnet Finder</h2>
                    <ol className="column">
                        {parentFinderStatistics.length === 0 ? (
                            <p>Loading...</p>
                        ) : (
                            parentFinderStatistics.map((stat) => {
                                const isPlural = stat.hits !== 1 ? 's' : ''
                                const year = stat.yearMonth.split('-')[0]
                                const month = getMonthName(
                                    stat.yearMonth.split('-')[1]
                                )
                                return (
                                    <li>{`${month} ${year}: ${stat.hits} request${isPlural}`}</li>
                                )
                            })
                        )}
                    </ol>
                    <h2>Quest Matcher</h2>
                    <ol className="column">
                        {questMatcherStatistics.length === 0 ? (
                            <p>Loading...</p>
                        ) : (
                            questMatcherStatistics.map((stat) => {
                                const isPlural = stat.hits !== 1 ? 's' : ''
                                const year = stat.yearMonth.split('-')[0]
                                const month = getMonthName(
                                    stat.yearMonth.split('-')[1]
                                )
                                return (
                                    <li>{`${month} ${year}: ${stat.hits} request${isPlural}`}</li>
                                )
                            })
                        )}
                    </ol>
                </section>
            </main>
        </>
    )
}
