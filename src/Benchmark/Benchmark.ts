import Action from "../Actions/Action";
import Bot from "../Bot";
import Factor from "../Factors/Factor";
import { BenchRun, Event, State } from "./Log";

export default class BenchMark {
    name
    targets: Factor<Action[]>[]
    runs: BenchRun[] = []

    constructor(name: string, targets: Factor<Action[]>[]) {
        this.name = name;
        this.targets = targets
    }

    run() {
        const steve = new Bot("Steve");
    
        steve.bot.once('spawn', () => {
            steve.bot.chat('/clear ' + steve.bot.username);
            steve.neededActions.push(...this.targets);
            const run: BenchRun = new BenchRun();

            this.runs.push(run);

            const startTime = Date.now();
        
            steve.on("factorChanged", (id: string, value: any) => {
                run.factors.push(new State(Date.now() - startTime, id, value));
            })
            
            steve.on("event", (id: string, reason: string) => {
                run.state.push(new Event(Date.now() - startTime, id, reason))
            })

            steve.once('finishedActions', () => {
                console.log(`Finished actions in ${Date.now() - startTime}ms`);
                run.state.push(new Event(Date.now() - startTime, "end", "finished actions"));
                run.save(this.name);
            });

            steve.once('end', () => {
                console.log(`cancelled at ${Date.now() - startTime}ms`);
                run.state.push(new Event(Date.now() - startTime, "end", "cancelled"));
                run.save(this.name);
            });
        });
    }
}