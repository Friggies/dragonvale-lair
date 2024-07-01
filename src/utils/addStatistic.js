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

    try {
        const { error } = await supabase.rpc('incrementstatistic', {
            yearmonth: yearMonth,
            table_name: table,
        })
        if (error) {
            throw new Error(error)
        }
    } catch (error) {
        console.error(error)
    }
}
