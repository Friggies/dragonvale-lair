import React, { ReactNode } from 'react'
import styles from './Section.module.scss'

interface SectionProps {
    title: string
    children: ReactNode
    isH1?: boolean
    className?: string
}

export default function Section({
    title,
    children,
    isH1,
    className,
}: SectionProps) {
    const id = title.replaceAll(' ', '-').toLowerCase()
    const HeadingTag = isH1 ? 'h1' : 'h2' // Dynamically assign heading tag
    const classNames = className
        ? `${className} ${styles.section}`
        : styles.section

    return (
        <section
            className={classNames}
            aria-describedby={id}
        >
            {React.createElement(
                HeadingTag,
                { className: styles.section__title, id },
                title
            )}
            {children}
        </section>
    )
}
