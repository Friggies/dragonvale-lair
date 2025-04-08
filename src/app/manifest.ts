import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'The DragonVale Lair',
        short_name: 'DVLair',
        description:
            'The DragonVale Lair is a collection of tools that helps you on your DragonVale journey',
        start_url: '/',
        display: 'standalone',
        background_color: '#282828',
        theme_color: '#282828',
        icons: [
            {
                src: '/favicon.ico',
                sizes: '159x159',
                type: 'image/ico',
            },
        ],
    }
}
