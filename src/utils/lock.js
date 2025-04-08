import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

class Lock {
    constructor(lockKey, timeout = 55000) {
        this.lockKey = lockKey
        this.timeout = timeout
        this.isLocked = false
    }

    async acquire() {
        const startTime = Date.now()

        while (true) {
            const now = new Date()
            const requestID = Math.floor(Math.random() * 10000)

            const { data: existingLock, error: selectError } = await supabase
                .from('locks')
                .select('locked, updated_at')
                .eq('lock_key', this.lockKey)
                .single()

            if (selectError && selectError.code !== 'PGRST116') {
                console.error('Error selecting lock:', selectError)
                throw new Error('Error selecting lock')
            }

            if (
                !existingLock.locked ||
                new Date(now) - new Date(existingLock.updated_at) > this.timeout
            ) {
                const { error: updateError } = await supabase
                    .from('locks')
                    .update({
                        locked: true,
                        updated_at: now,
                        request_id: requestID,
                    })
                    .eq('lock_key', this.lockKey)

                const { data } = await supabase
                    .from('locks')
                    .select('locked, updated_at, request_id')
                    .eq('lock_key', this.lockKey)

                if (updateError) {
                    console.error('Error updating lock:', updateError)
                    if (updateError.code === 'PGRST116') {
                        console.log('Lock got taken (retrying)')
                    } else {
                        throw new Error('Error acquiring lock')
                    }
                } else if (
                    data &&
                    new Date(data[0].updated_at).getTime() ===
                        new Date(now).getTime() &&
                    data[0].request_id === requestID
                ) {
                    console.log('Lock acquired successfully')
                    this.isLocked = true
                    return // Lock acquired
                }
            }

            if (Date.now() - startTime >= this.timeout) {
                console.error('Timeout acquiring lock')
            }

            await new Promise((resolve) =>
                setTimeout(
                    resolve,
                    Math.floor(Math.random() * (1000 - 500 + 1)) + 500
                )
            )
        }
    }

    async release() {
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
            console.error('Error releasing lock:', error)
            throw new Error('Failed to release lock')
        }
    }
}

export default Lock
