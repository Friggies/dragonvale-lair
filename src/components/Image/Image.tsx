import NextImage, { ImageProps } from 'next/image'
import styles from './Image.module.scss'

interface CustomImageProps extends ImageProps {
    variant?: 'large' | 'default' | string
}

export default function Image({
    variant = 'default',
    ...props
}: CustomImageProps) {
    return (
        <NextImage
            {...props}
            className={`${styles.image} ${styles[variant]}`}
            unoptimized
        />
    )
}
