export default class Lock {
    constructor() {
        this.locked = false
        this.queue = []
    }

    async acquire() {
        if (!this.locked) {
            this.locked = true
            return
        }
        return new Promise((resolve) => {
            this.queue.push(resolve)
        })
    }

    release() {
        if (this.queue.length > 0) {
            const next = this.queue.shift()
            next()
        } else {
            this.locked = false
        }
    }
}
