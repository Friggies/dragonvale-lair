import { ReactNode } from 'react'
import styles from './List.module.scss'

export default function List({ children }: { children: ReactNode[] }) {
    return (
        <ol className={styles.list}>
            {children.map((item, index) => {
                return (
                    <li
                        className={styles.item}
                        key={`${item}_${index}`}
                    >
                        {item}
                    </li>
                )
            })}
        </ol>
    )
}
