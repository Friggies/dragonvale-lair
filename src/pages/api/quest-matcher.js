import addStatistic from '@/utils/addStatistic'

export const config = {
    maxDuration: 1,
}

export default function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        try {
            addStatistic('quest-matcher-statistics')
            res.status(200).json({ error: false })
        } catch (error) {
            res.status(500).json({ error: true })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
