import '@/styles/main.scss'
import Image from 'next/image'
import StatisticsInit from '@/components/Statistics/StatisticsInit'
import MobileBanner from '@/components/MobileBanner/MobileBanner'
import Navigation from '@/components/Navigation/Navigation'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <Navigation />
                <MobileBanner />
                {children}
                <Image
                    src="/background.webp"
                    width="1000"
                    height="750"
                    quality="100"
                    alt=""
                    className="backgroundImage"
                />
                <StatisticsInit />
            </body>
        </html>
    )
}
