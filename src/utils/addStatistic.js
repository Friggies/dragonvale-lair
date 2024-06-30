import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

function getCurrentYearAndMonth() {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    let month = (currentDate.getMonth() + 1).toString()

    if (month.length === 1) {
        month = '0' + month
    }

    return `${year}-${month}`
}

export default async function addStatistic(table) {
    const yearMonth = getCurrentYearAndMonth()
    console.log(`Adding statistic for ${yearMonth} in table ${table}`)

    try {
        const { data, error: selectError } = await supabase
            .from(table)
            .select('hits')
            .eq('yearMonth', yearMonth)
            .single()

        if (selectError) {
            if (selectError.code === 'PGRST116') {
                console.log(
                    `No entry found for ${yearMonth}, inserting new record`
                )
                const { error: insertError } = await supabase
                    .from(table)
                    .insert([
                        {
                            yearMonth: yearMonth,
                            hits: 1,
                        },
                    ])

                if (insertError) {
                    console.error(`Insert Error: ${insertError.message}`)
                    throw new Error(`Could not create new ${table} statistic`)
                }
            } else {
                console.error(`Select Error: ${selectError.message}`)
                throw new Error(`Could not get hits from ${table} statistics`)
            }
        } else if (data) {
            console.log(`Entry found for ${yearMonth}, updating hits`)
            const { error: updateError } = await supabase
                .from(table)
                .update({ hits: data.hits + 1 })
                .eq('yearMonth', yearMonth)

            if (updateError) {
                console.error(`Update Error: ${updateError.message}`)
                throw new Error(`Could not add hit to ${table} statistics`)
            }
        }
    } catch (error) {
        console.error(`Caught Error: ${error.message}`)
    }
}
