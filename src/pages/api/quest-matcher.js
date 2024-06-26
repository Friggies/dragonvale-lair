import addStatistic from '@/utils/addStatistic'
import dragons from '/public/dragons.json'

export const config = {
    maxDuration: 20,
}

export default async function handler(req, res) {
    const { method } = req

    if (method === 'POST') {
        try {
            await addStatistic('quest-matcher-statistics')
            const formData = JSON.parse(req.body)
            const quest = formData.targetQuest
            const dragon = dragons.find((dragon) => dragon.quest === quest)
            res.status(200).json(dragon)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Failed to fetch data' })
        }
    } else {
        res.setHeader('Allow', ['POST'])
        res.status(405).end(`Method ${method} Not Allowed`)
    }
}
