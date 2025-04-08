import LabelButton from './LabelButton'

export default function MobileNavigation() {
    return (
        <nav className="mobileNavigation">
            <ul className="mobileNavigation__list">
                <li>
                    <LabelButton
                        label="Simulator"
                        link="/breeding-simulator"
                        imageName="heartButton"
                        isSmall
                    />
                </li>
                <li>
                    <LabelButton
                        label="Parent Finder"
                        link="/parent-finder"
                        imageName="loupeButton"
                        isSmall
                    />
                </li>
                <li>
                    <LabelButton
                        label="Dragonarium"
                        link="/dragonarium"
                        imageName="dragonariumButton"
                        isSmall
                    />
                </li>
                <li>
                    <LabelButton
                        label="Quests"
                        link="/quest-matcher"
                        imageName="dragonButton"
                        isSmall
                    />
                </li>
                <li>
                    <LabelButton
                        label="Misc."
                        link="/miscellaneous"
                        imageName="bookButton"
                        isSmall
                    />
                </li>
            </ul>
        </nav>
    )
}
