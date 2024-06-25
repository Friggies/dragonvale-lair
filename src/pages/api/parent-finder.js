import addStatistic from '@/utils/addStatistic'
import { getParentData } from '@/utils/googleSheet'
import Lock from '@/utils/lock.js'

const lock = new Lock('parent_finder_lock')

export const config = {
    maxDuration: 60,
}

export default async function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        await lock.acquire()
        try {
            const data = await getParentData(req.body)
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' })
        } finally {
            lock.release()
            addStatistic('parent-finder-statistics')
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
