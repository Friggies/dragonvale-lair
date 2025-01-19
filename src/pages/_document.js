import { Html, Head, Main, NextScript } from 'next/document'
import Header from '@/components/Header'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/favicon/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon/favicon-16x16.png"
                />
                <link
                    rel="manifest"
                    href="/favicon/site.webmanifest"
                />
                <link
                    rel="mask-icon"
                    href="/favicon/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <link
                    rel="shortcut icon"
                    href="/favicon/favicon.ico"
                />
                <meta
                    name="msapplication-TileColor"
                    content="#2d89ef"
                />
                <meta
                    name="msapplication-config"
                    content="/favicon/browserconfig.xml"
                />
                <meta
                    name="theme-color"
                    content="#ffffff"
                />
            </Head>
            <body>
                <Header />
                <Main />
                <NextScript />
                <script
                    data-collect-dnt="true"
                    async
                    src="https://scripts.simpleanalyticscdn.com/latest.js"
                ></script>
                <noscript>
                    <img
                        src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true"
                        alt=""
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </noscript>
            </body>
        </Html>
    )
}
