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
        let data = null
        let lockReleased = false

        try {
            await lock.acquire()
            data = await getParentData(req.body)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Failed to fetch data' })
            try {
                await lock.release()
                lockReleased = true
            } catch (releaseError) {
                console.error(
                    'Error releasing lock after failure:',
                    releaseError
                )
            }
            return
        } finally {
            if (!lockReleased) {
                try {
                    await lock.release()
                } catch (releaseError) {
                    console.error('Error releasing lock:', releaseError)
                }
            }
        }

        // If data is retrieved successfully, send the response and update statistics
        if (data) {
            res.status(200).json(data)
            try {
                await addStatistic('parent-finder-statistics')
            } catch (statError) {
                console.error('Error updating statistics:', statError)
            }
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
