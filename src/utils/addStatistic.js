import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

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
    try {
        let { data, error } = await supabase
            .from(table)
            .select('hits')
            .eq('yearMonth', yearMonth)
            .single()

        if (data) {
            let { error } = await supabase
                .from(table)
                .update({ hits: data.hits + 1 })
                .eq('yearMonth', yearMonth)

            if (error) {
                throw new Error(`Could not add hit to ${table} statistics`)
            }
        } else if (error.code === 'PGRST116') {
            let { error } = await supabase.from(table).insert([
                {
                    yearMonth: yearMonth,
                    hits: 1,
                },
            ])

            if (error) {
                throw new Error(`Could not create new ${table} statistic`)
            }
        } else {
            console.error(error)
            throw new Error(`Could not get hits from ${table} statistics`)
        }
    } catch (error) {
        console.error(error)
    }
}
