import Head from 'next/head'
import LabelButton from '@/components/LabelButton'

export default function Home() {
    const share = () => {
        const url = window.location.href
        const title = document.title
        if (navigator.share) {
            navigator.share({
                title: title,
                url: url,
            })
        } else {
            navigator.clipboard
                .writeText(url)
                .then(() => {
                    alert('Page URL copied to clipboard!')
                })
                .catch(() => {
                    alert('Unable to copy URL to clipboard')
                })
        }
    }
    return (
        <>
            <Head>
                <title>
                    Optimize your DragonVale experience - The DragonVale Lair
                </title>
                <meta
                    name="description"
                    content="The DragonVale Lair helps you to freely optimize your
                        Dragonvale gameplay experience by allowing you to
                        simulate breedings, find parent dragons and match quests
                        with dragons."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <main className="main">
                <section className="card">
                    <h1 className="card__title">Information</h1>
                    <p>
                        The DragonVale Lair helps you to freely optimize your
                        Dragonvale gameplay experience by allowing you to
                        simulate breedings, find parent dragons and match quests
                        with dragons. Everything operates with data from{' '}
                        <a
                            href="https://dragonvale-tips.proboards.com/thread/1393/dragonvale-compendium"
                            target="_blank"
                            className="link"
                        >
                            The DragonVale Compendium
                        </a>
                        . It furthermore draws heavily on inspiration and
                        nostalgia from our beloved{' '}
                        <a
                            href="https://dvbox.bin.sh/"
                            target="_blank"
                            className="link"
                        >
                            DragonVale Sandbox
                        </a>
                        .
                    </p>
                    <p>
                        Use the buttons at the top of every page to navigate
                        between the available tools. Each tool has a dedicated
                        "Help" section if you need further guidance on how to
                        use the tool. All tools are free to use and you can
                        always return to this page by pressing "The DragonVale
                        Lair". Enjoy.
                    </p>
                    <LabelButton
                        label="Share The DragonVale Lair"
                        imageName="friendButton"
                        tag="button"
                        type="button"
                        onClick={share}
                    />
                </section>
                <section className="card">
                    <h2 className="card__title">Disclaimer</h2>
                    <p>
                        This website uses assets from DragonVale, a property of
                        DECA Games. The assets presented here are solely for
                        entertainment purposes. This website is not endorsed by
                        DragonVale or DECA Games, and it does not hold any
                        affiliation with them. All copyrights and trademarks
                        related to DragonVale and its content are owned by their
                        respective holders. For the official DragonVale
                        experience, please obtain the game from authorized
                        sources.
                    </p>
                    <p>
                        <strong>Download DragonVale:</strong>
                    </p>
                    <div className="row row--toColumn">
                        <a
                            href="https://apps.apple.com/us/app/dragonvale/id440045374"
                            target="_blank"
                            aria-label="Get DragonVale from App Store"
                        >
                            <img
                                className="downloadImage"
                                height="100"
                                src="/appleStoreButton.png"
                                alt=""
                            />
                        </a>
                        <a
                            href="https://play.google.com/store/apps/details?id=com.backflipstudios.android.dragonvale&hl=en&pli=1"
                            target="_blank"
                            aria-label="Get DragonVale from Google Play"
                        >
                            <img
                                className="downloadImage"
                                height="100"
                                src="/googlePlayButton.webp"
                                alt=""
                            />
                        </a>
                    </div>
                </section>
            </main>
        </>
    )
}
