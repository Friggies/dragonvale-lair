import { getParentData } from '@/utils/googleSheet'
import Lock from '@/utils/lock.js'

const lock = new Lock()

export const config = {
    maxDuration: 60,
}

export default async function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        try {
            await lock.acquire()
            const data = await getParentData(req.body)
            lock.release()
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' })
            lock.release()
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
