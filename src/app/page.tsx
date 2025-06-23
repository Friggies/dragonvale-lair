import ShareButton from '@/components/ShareButton/ShareButton'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
    title: 'The DragonVale Lair - Optimize your DragonVale experience',
    description:
        'The DragonVale Lair helps you to freely optimize your Dragonvale gameplay experience by allowing you to simulate breedings, find parent dragons and match quests with dragons.',
}

export default function Index() {
    return (
        <main className="main">
            <section className="card">
                <h1 className="card__title">Information</h1>
                <p>
                    The DragonVale Lair helps you to freely optimize your
                    Dragonvale gameplay experience by allowing you to simulate
                    breedings, find parent dragons and match quests with
                    dragons. Everything operates with data from{' '}
                    <a
                        href="https://dragonvale-tips.proboards.com/thread/1393/dragonvale-compendium"
                        target="_blank"
                        className="link"
                    >
                        The DragonVale Compendium
                    </a>
                    . It furthermore draws heavily on inspiration and nostalgia
                    from our beloved{' '}
                    <a
                        href="https://dvbox.bin.sh/"
                        target="_blank"
                        className="link"
                    >
                        DragonVale Sandbox
                    </a>
                    . Also a special thanks to the handy{' '}
                    <a
                        href="https://dragonvale.fandom.com/wiki/DragonVale_Wiki"
                        target="_blank"
                        className="link"
                    >
                        DragonVale Wiki
                    </a>{' '}
                    for well-structured documentation and for all the website
                    graphics that I blatantly steal and reuse on this website.
                </p>
                <p>
                    Use the buttons at the top (or bottom on mobile) of every
                    page to navigate between the available tools. Each tool has
                    a dedicated "Help" section if you need further guidance on
                    how to use the tool. All tools are free to use and you can
                    always return to this page by pressing "The DragonVale Lair"
                    or by going to "Miscellaneous" &amp; "Homepage" on mobile.
                    Enjoy.
                </p>
                <ShareButton />
            </section>
            <section className="card">
                <h2 className="card__title">Disclaimer</h2>
                <p>
                    This website uses assets from DragonVale, a property of DECA
                    Games. The assets presented here are solely for
                    entertainment purposes. This website is not endorsed by
                    DragonVale or DECA Games, and it does not hold any
                    affiliation with them. All copyrights and trademarks related
                    to DragonVale and its content are owned by their respective
                    holders. For the official DragonVale experience, please
                    obtain the game from authorized sources.
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
                        <Image
                            className="downloadImage"
                            height="100"
                            width="332"
                            src="/buttons/appleStoreButton.png"
                            alt=""
                        />
                    </a>
                    <a
                        href="https://play.google.com/store/apps/details?id=com.backflipstudios.android.dragonvale&hl=en&pli=1"
                        target="_blank"
                        aria-label="Get DragonVale from Google Play"
                    >
                        <Image
                            className="downloadImage"
                            height="100"
                            width="340"
                            src="/buttons/googlePlayButton.webp"
                            alt=""
                        />
                        <img />
                    </a>
                </div>
            </section>
        </main>
    )
}
