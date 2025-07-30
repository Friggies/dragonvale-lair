import { Metadata } from 'next'
import { Tool } from './Tool'

export const metadata: Metadata = {
    title: 'Previous Tournaments By The DragonVale Lair',
    description:
        'This page displays the previous tournaments and the results by The DragonVale Lair. It includes detailed statistics about each tournament, such as the number of participants, the winners, and the date of the tournament.',
}

export default async function PreviousTournamentsPage() {
    return (
        <main className="main">
            <section className="card">
                <h1 className="card__title">Tournaments</h1>
                <Tool />
            </section>
        </main>
    )
}
