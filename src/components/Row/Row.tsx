import { ReactNode } from 'react'
import styles from './Row.module.scss'

export default function Row({ children }: { children: ReactNode[] }) {
    return (
        <ul className={styles.row}>
            {children.map((child, index) => (
                <li key={index}>{child}</li>
            ))}
        </ul>
    )
}
