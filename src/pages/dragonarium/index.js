import Head from 'next/head'

export default function Home() {
    return (
        <>
            <Head>
                <title>DragonVale Dragonarium - The DragonVale Lair</title>
                <meta
                    name="description"
                    content=""
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">Under construction</h1>
                    <img
                        className="building"
                        src="/building.webp"
                    />
                </section>
            </main>
        </>
    )
}
