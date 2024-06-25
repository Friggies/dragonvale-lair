import addStatistic from '@/utils/addStatistic'
import { getBreedingData } from '@/utils/googleSheet'
import Lock from '@/utils/lock.js'

const lock = new Lock('breeding_simulator_lock')

export const config = {
    maxDuration: 60,
}

export default async function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        try {
            await lock.acquire()
            const data = await getBreedingData(req.body)
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' })
        } finally {
            try {
                await lock.release()
                addStatistic('breeding-simulator-statistics')
            } catch (error) {
                console.error(error)
            }
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
