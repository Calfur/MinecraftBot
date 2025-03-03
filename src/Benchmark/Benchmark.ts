import Action from "../Actions/Action";
import Bot from "../Bot";
import Factor from "../Factors/Factor";
import logBot from "./log";

export default function BenchMark(initialTargets: Factor<Action[]>[]) {
    const steve = new Bot("Steve");
    var startTime: Date;
    
    steve.bot.once('spawn', () => {
        steve.bot.chat('/clear ' + steve.bot.username);
        steve.neededActions.push(...initialTargets);
        startTime = new Date();
    });
    steve.events.once('finishedActions', () => {
        console.log(`Finished actions in ${new Date().getMilliseconds() - startTime.getMilliseconds()}ms`);
    });
    steve.events.once('end', () => {
        console.log(`failed after ${new Date().getMilliseconds() - startTime.getMilliseconds()}ms`);
    });
    
    logBot(steve);
}