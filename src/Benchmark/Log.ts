import fs from 'fs';

export class BenchRun {
    factors: State[] = []
    state: Event[] = []

    save(benchMarkName: string) {
        const folder = "Benchmark/"+benchMarkName;
        if (!fs.existsSync("Benchmark")){
            fs.mkdirSync("Benchmark", {recursive: true});
        }
        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder, {recursive: true});
        }
        fs.writeFile(
            folder + "/" + new Date().toISOString().replace(/:/g, "-") + ".json", 
            JSON.stringify(this), 
            function(err: any) {
                if (err) {
                    console.log(err);
                }
            }
        );
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