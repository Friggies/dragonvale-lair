import { getParentData } from '@/utils/googleSheet'

export const config = {
    maxDuration: 60,
}

export default async function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        try {
            const data = await getParentData(req.body)
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
