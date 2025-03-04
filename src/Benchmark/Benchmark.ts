import fs from 'fs';
import Action from "../Actions/Action";
import Bot from "../Bot";
import Factor from "../Factors/Factor";
import { Event, State } from "./LogTypes";

export default class BenchMark {
    name
    targets: Factor<Action[]>[]
    factors: State[] = []
    events: Event[] = []

    constructor(name: string, targets: Factor<Action[]>[]) {
        this.name = name;
        this.targets = targets
    }

    run() {
        const steve = new Bot("Steve");
    
        steve.bot.once('spawn', () => {
            steve.bot.chat('/clear ' + steve.bot.username);
            steve.neededActions.push(...this.targets);

            const startTime = Date.now();

            steve.on("factorChanged", (id: string, value: any) => {
                this.factors.push(new State(Date.now() - startTime, id, value));
            })
            
            steve.on("event", (id: string, reason: string) => {
                this.events.push(new Event(Date.now() - startTime, id, reason))
            })

            steve.once('finishedActions', () => {
                console.log(`Finished actions in ${Date.now() - startTime}ms`);
                this.events.push(new Event(Date.now() - startTime, "end", "finished actions"));
                this.save();
            });

            steve.once('end', () => {
                console.log(`cancelled at ${Date.now() - startTime}ms`);
                this.events.push(new Event(Date.now() - startTime, "end", "cancelled"));
                this.save();
            });
        });
    }

    save(): void {
        const benchmarkFolder = `Benchmark/${this.name}`;
        const benchmarkFile = `${benchmarkFolder}/${new Date().toISOString().replace(/:/g, "-")}.json`;

        // Create the Benchmark folder if it doesn't exist
        if (!fs.existsSync("Benchmark")) {
            fs.mkdirSync("Benchmark", { recursive: true });
        }

        // Create the benchmark folder if it doesn't exist
        if (!fs.existsSync(benchmarkFolder)) {
            fs.mkdirSync(benchmarkFolder, { recursive: true });
        }

        // Write the benchmark results to a file
        fs.writeFile(benchmarkFile, JSON.stringify(this), () => {
            console.log(`Benchmark results saved to ${benchmarkFile}`);
        });
    }
}