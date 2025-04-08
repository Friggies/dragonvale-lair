import Image from 'next/image'
import Link from 'next/link'
import { MouseEventHandler } from 'react'

interface LabelButtonProps {
    label: string
    link?: string
    imageName: string
    tag?: 'button' | 'link'
    type?: 'button' | 'submit' | 'reset'
    onClick?: MouseEventHandler<HTMLButtonElement>
    isSmall?: boolean
}

export default function LabelButton({
    label,
    link,
    imageName,
    tag,
    type = 'button',
    onClick,
    isSmall = false,
}: LabelButtonProps) {
    const labelClass = isSmall
        ? 'labelButton labelButton--small'
        : 'labelButton'

    if (tag === 'button') {
        return (
            <button
                id={label.toLowerCase().replaceAll(' ', '-')}
                type={type}
                className={labelClass}
                onClick={onClick}
            >
                {label}
                <Image
                    className="labelButton__image"
                    loading="lazy"
                    quality={100}
                    width={60}
                    height={60}
                    src={`/buttons/${imageName}.webp`}
                    alt=""
                    unoptimized
                />
            </button>
        )
    }
    return (
        <Link
            href={link!}
            className={labelClass}
        >
            {label}
            <Image
                className="labelButton__image"
                loading="lazy"
                quality={100}
                width={60}
                height={60}
                src={`/buttons/${imageName}.webp`}
                alt=""
                unoptimized
            />
        </Link>
    )
}
