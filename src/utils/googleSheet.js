import allDragons from '../../public/dragons.json'

const { google } = require('googleapis')
const { default: splitArrayBreeding } = require('./splitArrayBreeding')
const { default: splitArrayParent } = require('./splitArrayParent')

const private_key = process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
const client_email = process.env.PRIVATE_EMAIL

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email,
        private_key,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
})

const spreadsheetId = '1846qGyqVIzrJE2RFSWeBYJ2hkdZp_RulqQ-B-7odA34'

async function getBreedingData(values) {
    try {
        const formData = JSON.parse(values)
        const authClient = await auth.getClient()
        const sheets = google.sheets({ version: 'v4', auth: authClient })

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            resource: {
                valueInputOption: 'USER_ENTERED',
                data: [
                    {
                        range: 'Breeding Sim!A3:B3',
                        values: [[formData.dragon1]],
                    },
                    {
                        range: 'Breeding Sim!C3:E3',
                        values: [[formData.dragon2]],
                    },
                    {
                        range: 'Breeding Sim!F3',
                        values: [[formData.beb]],
                    },
                    {
                        range: 'Breeding Sim!G3:H3',
                        values: [[formData.cave]],
                    },
                    {
                        range: 'Breeding Sim!I3:J3',
                        values: [[formData.time]],
                    },
                    {
                        range: 'Breeding Sim!K3',
                        values: [[formData.weather]],
                    },
                    {
                        range: 'Breeding Sim!P3',
                        values: [[formData.own]],
                    },
                    {
                        range: 'Breeding Sim!Q3:R3',
                        values: [[formData.targetDragon]],
                    },
                ],
            },
        })

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Breeding Sim!A7:AS46',
        })

        let currentBreedingResults = splitArrayBreeding(response.data.values)
        const sort = formData.sort
        if (sort === 'TimeAsc') {
            currentBreedingResults.sort(
                (a, b) => a[2].replaceAll(':', '') - b[2].replaceAll(':', '')
            )
        } else if (sort === 'TimeDesc') {
            currentBreedingResults.sort(
                (a, b) => b[2].replaceAll(':', '') - a[2].replaceAll(':', '')
            )
        } else if (sort === 'ChanceDesc') {
            currentBreedingResults.sort(
                (a, b) => b[1].replace('%', '') - a[1].replace('%', '')
            )
        }

        return currentBreedingResults
    } catch (error) {
        throw error
    }
}

async function getParentData(values) {
    try {
        const formData = JSON.parse(values)
        const authClient = await auth.getClient()
        const sheets = google.sheets({ version: 'v4', auth: authClient })

        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId,
            resource: {
                valueInputOption: 'USER_ENTERED',
                data: [
                    {
                        range: 'Combo Finder!A3:C3',
                        values: [[formData.targetDragon]],
                    },
                    {
                        range: 'Combo Finder!D3:E3',
                        values: [[formData.beb]],
                    },
                    {
                        range: 'Combo Finder!G3',
                        values: [[formData.cave]],
                    },
                    {
                        range: 'Combo Finder!H3:I3',
                        values: [[formData.includeParent]],
                    },
                    {
                        range: 'Combo Finder!Q3:T3',
                        values: [
                            [formData.mustInclude || 'Any (No Restrictions)'],
                        ],
                    },
                ],
            },
        })

        const getUpdatedParentsData = await sheets.spreadsheets.values.batchGet(
            {
                spreadsheetId,
                ranges: [
                    'Combo Finder!A4:M5', // relevantBreedingString
                    'Combo Finder!A8:W57', // allBreedingResults
                ],
            }
        )

        const informationString =
            getUpdatedParentsData.data.valueRanges[0].values[0][0]

        let currentBreedingResults
        if (
            getUpdatedParentsData.data.valueRanges[1].values[0][1] === undefined
        ) {
            currentBreedingResults = 'NODATA'
            return [currentBreedingResults, informationString]
        }

        currentBreedingResults = splitArrayParent(
            getUpdatedParentsData.data.valueRanges[1].values
        )

        currentBreedingResults.forEach((result) => {
            function getWeightForAvailability(dragon) {
                console.log(dragon)
                return dragon.availability === 'LIMITED' ? 30 : 0
            }
            function getWeightForRarity(dragon) {
                switch (dragon.rarity) {
                    case 'Hybrid':
                        return 10
                    case 'Rare':
                        return 20
                    case 'Epic':
                    case 'Galaxy':
                        return 30
                    default:
                        return 0
                }
            }

            function calculateWeight(firstDragon, secondDragon) {
                let weight = 0
                weight += getWeightForAvailability(firstDragon)
                weight += getWeightForAvailability(secondDragon)
                weight += getWeightForRarity(firstDragon)
                weight += getWeightForRarity(secondDragon)
                return weight
            }

            const firstDragon = allDragons.find(
                (dragon) => dragon.name === result[0].split('+')[0]
            )
            const secondDragon = allDragons.find(
                (dragon) => dragon.name === result[0].split('+')[1]
            )

            result.weight = calculateWeight(firstDragon, secondDragon)
        })

        currentBreedingResults.sort((a, b) => a.weight - b.weight)

        return [currentBreedingResults, informationString]
    } catch (error) {
        throw error
    }
}

module.exports = { getBreedingData, getParentData }
