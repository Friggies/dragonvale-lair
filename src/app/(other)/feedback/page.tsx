import Section from '@/components/Section/Section'
import { Metadata } from 'next'
import Tool from './Tool'

export const metadata: Metadata = {
    title: 'The DragonVale Lair Feedback & Ideas',
    description:
        'Do you have feedback or new iears for The DragonVale Lair? I am all ears, please tell me everything about it.',
}

export default function Page() {
    return (
        <main className="main">
            <Section
                title="Feedback & Ideas"
                isH1
            >
                <p>
                    You are more than welcome to give feedback or send me a
                    message if you have ideas/improvements for the Lair. I am
                    also reachable on{' '}
                    <a
                        href="https://www.reddit.com/user/First-Ostrich9616/"
                        target="_blank"
                        className="link"
                    >
                        Reddit
                    </a>{' '}
                    if you feel like a longer conversation is necessary. I can
                    not reply to any messages or feedback through this form, but
                    I happily read everything.
                </p>
                <Tool />
            </Section>
        </main>
    )
}
