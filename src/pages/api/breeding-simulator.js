import { getBreedingData } from '@/utils/googleSheet'
import Lock from '@/utils/lock.js'

const breedingSimulatorLock = new Lock()

export const config = {
    maxDuration: 60,
}

export default async function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        await breedingSimulatorLock.acquire()
        try {
            const data = await getBreedingData(req.body)
            res.status(200).json(data)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' })
        } finally {
            breedingSimulatorLock.release()
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
