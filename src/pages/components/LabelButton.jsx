export default function LabelButton({
    label,
    link,
    imageName,
    tag,
    type,
    onClick,
}) {
    if (tag === 'button') {
        return (
            <button
                id={label.toLowerCase().replaceAll(' ', '-')}
                type={type}
                className="labelButton"
                onClick={onClick}
            >
                {label}
                <img
                    className="labelButton__image"
                    width="60"
                    height="60"
                    src={imageName + '.webp'}
                    alt=""
                />
            </button>
        )
    }
    return (
        <a
            href={link}
            className="labelButton"
        >
            {label}
            <img
                className="labelButton__image"
                width="60"
                height="60"
                src={imageName + '.webp'}
                alt=""
            />
        </a>
    )
}
