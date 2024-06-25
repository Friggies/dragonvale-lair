const { createClient } = require('@supabase/supabase-js')
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

class Lock {
    constructor(lockKey, timeout = 30000, retryAttempts = 5, retryDelay = 500) {
        this.lockKey = lockKey
        this.timeout = timeout
        this.retryAttempts = retryAttempts
        this.retryDelay = retryDelay
        this.isLocked = false
    }

    async acquire() {
        const startTime = Date.now()

        while (true) {
            const now = new Date()
            const { data: existingLock, error: selectError } = await supabase
                .from('locks')
                .select('locked, updated_at')
                .eq('lock_key', this.lockKey)
                .single()

            if (selectError) {
                console.error('Error selecting lock:', selectError)
                throw new Error('Error selecting lock')
            }

            if (
                !existingLock ||
                !existingLock.locked ||
                (existingLock.locked &&
                    now - new Date(existingLock.updated_at) > this.timeout)
            ) {
                const { data, error: updateError } = await supabase
                    .from('locks')
                    .update({
                        locked: true,
                        updated_at: now,
                    })
                    .eq('lock_key', this.lockKey)
                    .select()

                if (updateError) {
                    console.error('Error upserting lock:', updateError)
                    if (updateError?.code === '23505') {
                        console.log('Lock got taken (retrying)')
                    } else {
                        throw new Error('Error acquiring lock')
                    }
                } else if (
                    data[0].updated_at !==
                    now.toISOString().replace('Z', '+00:00')
                ) {
                    console.log('Lock got taken (retrying)')
                } else {
                    console.log('Lock acquired successfully')
                    this.isLocked = true
                    return // Lock acquired
                }
            }

            if (Date.now() - startTime >= this.timeout) {
                throw new Error('Timeout acquiring lock')
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 333 + Math.floor(Math.random() * 1500))
            )
        }
    }

    async release(attempt = 1) {
        if (!this.isLocked) {
            return
        }

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
            this.isLocked = false
        } catch (error) {
            console.error(`Error in release attempt ${attempt}:`, error)
            if (attempt < this.retryAttempts) {
                await new Promise((resolve) =>
                    setTimeout(resolve, this.retryDelay)
                )
                return this.release(attempt + 1)
            } else {
                throw new Error(
                    'Failed to release lock after multiple attempts'
                )
            }
        }
    }
}

module.exports = Lock
