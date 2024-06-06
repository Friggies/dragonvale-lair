import LabelButton from './LabelButton'

export default function Header() {
    return (
        <header className="header card">
            <a
                href="/"
                className="header__title card__title"
            >
                The DragonVale Lair
            </a>
            <ul className="header__list">
                <li>
                    <LabelButton
                        label="Breeding Simulator"
                        link="/breeding-simulator"
                        imageName="heartButton"
                    />
                </li>
                <li>
                    <LabelButton
                        label="Parent Finder"
                        link="/parent-finder"
                        imageName="loupeButton"
                    />
                </li>
                <li>
                    <LabelButton
                        label="Quest Matcher"
                        link="/quest-matcher"
                        imageName="dragonButton"
                    />
                </li>
                <li>
                    <LabelButton
                        label="Name That Egg"
                        link="https://namethategg.com/"
                        imageName="eggButton"
                    />
                </li>
            </ul>
        </header>
    )
}
