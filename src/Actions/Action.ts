import mineflayer from "mineflayer"
import Bot from "../Bot"
import Factor from "../Factors/Factor"

export default abstract class Action {
    id: string
    stopped = false
    canRun: Factor<boolean>
    currentEffort: Factor<number>
    FutureEffort: Factor<number>
    
    constructor(id: string, canRun: Factor<boolean>, currentEffort: Factor<number>, FutureEffort: Factor<number>) {
        this.id = id
        this.canRun = canRun
        this.currentEffort = currentEffort
        this.FutureEffort = FutureEffort
    }

    // Executes the action
    abstract run(bot: Bot): void;

    // Stops the action if it's running
    protected abstract abortAction(bot: mineflayer.Bot): void 

    stop(bot: mineflayer.Bot): void {
        this.abortAction(bot)
        this.stopped = true
    }
}