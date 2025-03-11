export class State {
    time: number
    id: string
    value: any

    constructor(time: number, id: string, value: any) {
        this.time = time
        this.id = id
        this.value = value
    }
}

export class Event {
    time: number
    id: string
    text: string

    constructor(time: number, id: string, text: string) {
        this.time = time
        this.id = id
        this.text = text
    }
}