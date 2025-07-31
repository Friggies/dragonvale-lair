import { ReactNode } from 'react'
import styles from './Details.module.scss'

export default function Details({
    children,
    title,
}: {
    children: ReactNode
    title: string
}) {
    return (
        <details className={styles.details}>
            <summary className={styles.summary}>
                <h2>{title}</h2>
            </summary>
            {children}
        </details>
    )
}
