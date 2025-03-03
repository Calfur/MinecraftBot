import Action from "../Actions/Action";
import Bot from "../Bot";
import Factor from "../Factors/Factor";
import fs from 'fs';

function saveLog(log: any) {
    if (!fs.existsSync("log")){
        fs.mkdirSync("log");
    }
    fs.writeFile("log/"+new Date().toISOString().replace(/:/g, "-")+".json", JSON.stringify(log), function(err: any) {
        if (err) {
            console.log(err);
        }
    });
}

export default function BenchMark(initialTargets: Factor<Action[]>[]) {
    const steve = new Bot("Steve");
    
    steve.bot.once('spawn', () => {
        steve.bot.chat('/clear ' + steve.bot.username);
        steve.neededActions.push(...initialTargets);
        const log: {
            factors: {
                time: number, 
                id: string, 
                value: any
            }[],
            actionFails: {
                time: number, 
                id: string, 
                reason: string
            }[]
        } = {factors: [], actionFails: []};

        const startTime = Date.now();
    
        steve.on("factorChanged", (id: string, value: any) => {
            log.factors.push({time: Date.now() - startTime, id, value})
        })
        
        steve.on("actionFailed", (id: string, reason: string) => {
            log.actionFails.push({time: Date.now() - startTime, id, reason})
        })

        steve.once('finishedActions', () => {
            console.log(`Finished actions in ${Date.now() - startTime}ms`);
            saveLog(log);
        });

        steve.once('end', () => {
            console.log(`cancelled at ${Date.now() - startTime}ms`);
            saveLog(log);
        });
    });
}