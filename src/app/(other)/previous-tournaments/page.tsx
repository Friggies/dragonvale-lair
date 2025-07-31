import { Metadata } from 'next'
import { AC14 } from './AC14'
import { AC13 } from './AC13'

export const metadata: Metadata = {
    title: 'Previous Tournaments By The DragonVale Lair',
    description:
        'This page displays the previous tournaments and the results by The DragonVale Lair. It includes detailed statistics about each tournament, such as the number of participants, the winners, and the date of the tournament.',
}

export default async function PreviousTournamentsPage() {
    return (
        <main className="main">
            <section className="card">
                <h1 className="card__title">Previous Tournaments</h1>
                <AC14 />
                <AC13 />
            </section>
        </main>
    )
}
