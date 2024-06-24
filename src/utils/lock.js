const Redis = require('ioredis')
const redis = new Redis(process.env.KV_URL, {
    password: process.env.KV_REST_API_TOKEN,
    tls: {
        rejectUnauthorized: true,
    },
})

class Lock {
    constructor(lockKey) {
        this.lockKey = lockKey
    }

    async acquire() {
        while (true) {
            const lock = await redis.set(this.lockKey, 'locked', 'NX', 'EX', 60)
            if (lock) return
            await new Promise((resolve) => setTimeout(resolve, 100))
        }
    }

    async release() {
        await redis.del(this.lockKey)
    }
}

module.exports = Lock
