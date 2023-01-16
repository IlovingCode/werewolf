import { game } from "cc"

class Task {
    check(callback: Function) {
        return new Promise((resolve, reject) => {
            this.iters.push(this.waitUntil(callback, resolve))
        })
    }

    delay(second: number) {
        return new Promise((resolve, reject) => {
            this.iters.push(this.waitFor(second, resolve))
        })
    }

    *waitFor(second: number, complete: Function) {
        while (second > 0) {
            second -= game.deltaTime
            yield second
        }

        complete()
    }

    *waitUntil(callback: Function, complete: Function) {
        while (!callback()) yield false

        complete()
    }

    iters: Generator[] = []

    update() {
        let iters = this.iters
        let left = 0
        let right = iters.length - 1
        while (left <= right) {
            if (iters[left].next().done) {
                iters[left] = iters[right]
                iters[right--] = null
            } else left++
        }

        iters.length = left
    }
}

const taskController = new Task
export default taskController

