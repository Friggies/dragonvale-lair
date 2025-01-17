import Head from 'next/head'

export default function Home() {
    return (
        <>
            <Head>
                <title>404 Page not found - The DragonVale Lair</title>
                <meta
                    name="description"
                    content=""
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <meta
                    name="robots"
                    content="noindex"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">404 - This page is missing</h1>
                    <p>
                        The page you’re looking for doesn’t seem to exist. It
                        might have been moved, renamed, or simply vanished.
                    </p>
                </section>
            </main>
        </>
    )
}
