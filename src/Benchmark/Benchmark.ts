import Action from "../Actions/Action";
import Bot from "../Bot";
import Factor from "../Factors/Factor";
import fs from 'fs';
import { BotLog, Event, State } from "./Log";

export default function BenchMark(initialTargets: Factor<Action[]>[]) {
    const steve = new Bot("Steve");
    
    steve.bot.once('spawn', () => {
        steve.bot.chat('/clear ' + steve.bot.username);
        steve.neededActions.push(...initialTargets);
        const log: BotLog = new BotLog();

        const startTime = Date.now();
    
        steve.on("factorChanged", (id: string, value: any) => {
            log.factors.push(new State(Date.now() - startTime, id, value));
        })
        
        steve.on("event", (id: string, reason: string) => {
            log.events.push(new Event(Date.now() - startTime, id, reason))
        })

        steve.once('finishedActions', () => {
            console.log(`Finished actions in ${Date.now() - startTime}ms`);
            log.events.push(new Event(Date.now() - startTime, "end", "finished actions"));
            log.save();
        });

        steve.once('end', () => {
            console.log(`cancelled at ${Date.now() - startTime}ms`);
            log.events.push(new Event(Date.now() - startTime, "end", "cancelled"));
            log.save();
        });
    });
}