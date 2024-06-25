const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

class Lock {
    constructor(lockKey) {
        this.lockKey = lockKey
    }

    async acquire() {
        const startTime = Date.now()

        while (true) {
            try {
                // Check if the lock already exists
                const { data: existingLock, error: selectError } =
                    await supabase
                        .from('locks')
                        .select('locked, updated_at')
                        .eq('lock_key', this.lockKey)
                        .single()

                if (selectError) {
                    console.error('Error selecting lock:', selectError)
                    throw new Error('Error selecting lock')
                }

                const now = new Date()
                if (
                    !existingLock ||
                    !existingLock.locked ||
                    (existingLock.locked &&
                        now - new Date(existingLock.updated_at) > 60000)
                ) {
                    const { data, error: upsertError } = await supabase
                        .from('locks')
                        .upsert(
                            {
                                lock_key: this.lockKey,
                                locked: true,
                                updated_at: now,
                            },
                            { onConflict: ['lock_key'] }
                        )

                    if (upsertError) {
                        console.error('Error upserting lock:', upsertError)
                        if (upsertError.code === '23505') {
                            throw new Error('Lock got taken (retrying)')
                        }
                        throw new Error('Error acquiring lock')
                    }
                    console.log('Lock acquired successfully')
                    return // Lock acquired
                }
            } catch (error) {
                console.error('Error in acquire loop:', error)
            }

            // Check if the timeout has been reached
            if (Date.now() - startTime >= 60000) {
                throw new Error('Timeout acquiring lock')
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 250 + Math.floor(Math.random() * 100))
            )
        }
    }

    async release() {
        try {
            const { error: updateError } = await supabase
                .from('locks')
                .update({ locked: false, updated_at: new Date() })
                .eq('lock_key', this.lockKey)

            if (updateError) {
                console.error('Error releasing lock:', updateError)
                throw new Error('Error releasing lock')
            }
            console.log('Lock released successfully')
        } catch (error) {
            console.error('Error in release:', error)
        }
    }
}

module.exports = Lock
