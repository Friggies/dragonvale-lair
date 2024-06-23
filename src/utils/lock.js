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
        return new Promise((resolve) => this.queue.push(resolve))
    }

    release() {
        if (this.queue.length > 0) {
            const next = this.queue.shift()
            console.log('Queue: ' + (this.queue.length + 1))
            next()
        } else {
            this.locked = false
        }
    }
}
