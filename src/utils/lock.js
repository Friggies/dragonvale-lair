const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

class Lock {
    constructor(lockKey) {
        this.lockKey = lockKey
    }

    async acquire() {
        while (true) {
            try {
                // Check if the lock already exists
                const { data: existingLock } = await supabase
                    .from('locks')
                    .select('locked')
                    .eq('lock_key', this.lockKey)
                    .single()

                if (!existingLock.locked) {
                    // Try to acquire the lock by inserting the lock record
                    const { error } = await supabase
                        .from('locks')
                        .update({ locked: true })
                        .eq('lock_key', this.lockKey)

                    if (error) {
                        // If another lock record has been inserted already
                        if (error.code === '23505') {
                            throw new Error('Lock got taken (retrying)')
                        }
                        throw new Error('Error acquiring lock')
                    }
                    return // Lock acquired
                }
            } catch (error) {
                console.error(error)
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 250 + Math.floor(Math.random() * 100))
            )
        }
    }

    async release() {
        try {
            const { error } = await supabase
                .from('locks')
                .update({ locked: false })
                .eq('lock_key', this.lockKey)

            if (error) {
                throw new Error('Error releasing lock')
            }
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports = Lock
