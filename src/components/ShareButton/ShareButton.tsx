'use client'
import LabelButton from '../LabelButton'

export default function ShareButton() {
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
        <LabelButton
            label="Share The DragonVale Lair"
            imageName="friendButton"
            tag="button"
            type="button"
            onClick={share}
        />
    )
}
