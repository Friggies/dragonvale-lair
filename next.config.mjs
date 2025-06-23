/** @type {import('next').NextConfig} */
import fs from 'fs'
import path from 'path'

const nextConfig = {
    reactStrictMode: true,
    async headers() {
        const eggDir = path.join(__dirname, 'public', 'eggs')
        const files = fs.existsSync(eggDir)
            ? fs
                  .readdirSync(eggDir)
                  .filter((f) => f.toLowerCase().endsWith('.png'))
            : []

        // Exact-file rules for existing PNGs → long, immutable cache
        const exactRules = files.map((file) => ({
            source: `/eggs/${file}`,
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, immutable',
                },
            ],
        }))

        // Fallback for any other /eggs/*.png → short, revalidating cache
        exactRules.push({
            source: '/eggs/(.*)\\.png',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=60, must-revalidate',
                },
            ],
        })

        return exactRules
    },
}

export default nextConfig
