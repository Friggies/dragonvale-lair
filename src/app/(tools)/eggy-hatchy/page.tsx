import { Metadata } from 'next'
import Section from '@/components/Section/Section'
import Tool from './Tool'
import { createClient } from '@supabase/supabase-js'

export const metadata: Metadata = {
    title: 'Eggy Hatchy - The DragonVale Lair',
    description: '',
}

export default async function EggyHatchy() {
    const supabase = createClient(
        'https://evrjimpvbkritkiantsx.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cmppbXB2YmtyaXRraWFudHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkyNjAxMDEsImV4cCI6MjAzNDgzNjEwMX0.kU029veAv9sk1klaML-e49jNAFq9US4bZHxCUPVcVKU'
    )
    let { data: highest_total_points_by_friend, error } = await supabase
        .from('highest_total_points_by_friend')
        .select('*')

    console.log(highest_total_points_by_friend)

    return (
        <main className="main">
            <Section
                title="Eggy Hatchy"
                className="game"
                isH1
            >
                <Tool />
            </Section>
            <Section title="Leaderboard">
                {highest_total_points_by_friend ? (
                    <ol>
                        {highest_total_points_by_friend.map((row) => (
                            <li key={row.friend_id}>
                                <span>{row.friend_id}</span>
                                <span>{row.max_total_points}</span>
                            </li>
                        ))}
                    </ol>
                ) : (
                    <p></p>
                )}
            </Section>
            <Section title="Information">
                <p></p>
            </Section>
        </main>
    )
}
