import fs from 'fs'
import path from 'path'

function main() {
    const eggDir = path.join(process.cwd(), 'public', 'eggs')
    if (!fs.existsSync(eggDir) || !fs.statSync(eggDir).isDirectory()) {
        console.error(`Cannot find or access directory: ${eggDir}`)
        process.exit(1)
    }

    const entries = fs
        .readdirSync(eggDir)
        .filter((file) => file.toLowerCase().endsWith('.png'))

    const headers = []

    for (const file of entries) {
        if (!file.trim()) continue
        headers.push({
            source: `/eggs/${file}`,
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'public, max-age=31536000, immutable',
                },
            ],
        })
    }

    headers.push({
        source: '/eggs/(.*)\\.png',
        headers: [
            {
                key: 'Cache-Control',
                value: 'public, max-age=60, must-revalidate',
            },
        ],
    })

    const out = { headers }
    const outPath = path.join(process.cwd(), 'vercel.json')

    try {
        fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n')
        console.log(`Generated vercel.json with ${headers.length} rules`)
    } catch (e) {
        console.error(`Failed to write ${outPath}:`, e)
        process.exit(1)
    }
}

main()
