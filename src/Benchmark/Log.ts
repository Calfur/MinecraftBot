import fs from 'fs';

export class BotLog {
    factors: State[] = []
    events: Event[] = []

    save() {
        if (!fs.existsSync("log")){
            fs.mkdirSync("log");
        }
        fs.writeFile("log/"+new Date().toISOString().replace(/:/g, "-")+".json", JSON.stringify(this), function(err: any) {
            if (err) {
                console.log(err);
            }
        });
    }
}

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