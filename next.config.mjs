import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
export default {
    reactStrictMode: true,
    async headers() {
        const eggDir = path.join(__dirname, 'public', 'eggs')
        const files = fs.existsSync(eggDir)
            ? fs
                  .readdirSync(eggDir)
                  .filter((f) => f.toLowerCase().endsWith('.png'))
            : []

        console.log('> eggs:', files) // ← for debugging

        const exactRules = files.map((file) => ({
            source: `/eggs/${file}`,
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, immutable',
                },
            ],
        }))

        exactRules.push({
            source: '/eggs/(.*)\\.png',
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=60, must-revalidate',
                },
            ],
        })

        console.log(exactRules)

        return exactRules
    },
}
