import addStatistic from '@/utils/addStatistic'
import dragons from '/public/dragons.json'

export const config = {
    maxDuration: 20,
}

export default async function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        try {
            const formData = JSON.parse(req.body)
            const quest = formData.targetQuest
            const dragon = dragons.find((dragon) => dragon.quest === quest)
            res.status(200).json(dragon)
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch data' })
        } finally {
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
