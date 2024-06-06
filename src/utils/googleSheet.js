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
                ],
            },
        })

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Breeding Sim!A7:AS46',
        })

        let currentBreedingResults = splitArrayBreeding(response.data.values)
        currentBreedingResults.sort(
            (a, b) => b[1].replace('%', '') - a[1].replace('%', '')
        )

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

        const relevantBreedingString = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Combo Finder!A4:M5',
        })
        const informationString = relevantBreedingString.data.values[0][0]

        const allBreedingResults = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'Combo Finder!A8:W57',
        })

        let currentBreedingResults
        if (allBreedingResults.data.values[0][1] === undefined) {
            currentBreedingResults = 'NODATA'
            return [currentBreedingResults, informationString]
        }

        currentBreedingResults = splitArrayParent(
            allBreedingResults.data.values
        )
        currentBreedingResults.sort(
            (a, b) => b[1].replace(/\D+/g, '') - a[1].replace(/\D+/g, '')
        )

        return [currentBreedingResults, informationString]
    } catch (error) {
        console.error('Error in getParentData:', error)
        throw error
    }
}

module.exports = { getBreedingData, getParentData }
