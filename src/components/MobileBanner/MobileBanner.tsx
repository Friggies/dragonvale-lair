'use client'
import { useEffect, useState } from 'react'
import styles from './MobileBanner.module.scss'
import Image from 'next/image'

export default function MobileBanner() {
    const [hasMounted, setHasMounted] = useState(false)
    const [isPWA, setIsPWA] = useState(false)
    const [isHidden, setIsHidden] = useState(false)
    const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>(
        'other'
    )

    useEffect(() => {
        setHasMounted(true)

        const isStandalone =
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone

        setIsPWA(isStandalone)

        const hidden = localStorage.getItem('hideMobileBanner') === 'true'
        setIsHidden(hidden)

        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase()
        if (/iphone|ipad|ipod/.test(userAgent)) {
            setPlatform('ios')
        } else if (/android/.test(userAgent)) {
            setPlatform('android')
        }
    }, [])

    if (!hasMounted || isPWA || isHidden || platform === 'other') return null

    return (
        <div className={styles.banner}>
            <p>
                {platform === 'ios' ? (
                    <>
                        To install website as an app, tap the{' '}
                        <strong>Share</strong> button and select{' '}
                        <strong>"Add to Home Screen"</strong>.
                    </>
                ) : (
                    <>
                        To install website as an app, tap the{' '}
                        <strong>Menu</strong> button and select{' '}
                        <strong>"Add to Home Screen"</strong>.
                    </>
                )}
            </p>
            <button
                className={styles.button}
                onClick={() => {
                    setIsHidden(true)
                    localStorage.setItem('hideMobileBanner', 'true')
                }}
                aria-label="Hide banner"
                type="button"
            >
                <Image
                    src="/buttons/xButton.png"
                    width="30"
                    height="30"
                    alt="Close banner"
                />
            </button>
        </div>
    )
}
