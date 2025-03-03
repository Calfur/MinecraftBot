import mineflayer from "mineflayer"
import Bot from "../Bot"
import Factor from "../Factors/Factor"

export default abstract class Action {
    id: string
    stopped = false
    canRun: Factor<boolean>
    currentEffort: Factor<number>
    FutureEffort: Factor<number>
    Dependencies: Factor<Action[]>
    
    constructor(id: string, canRun: Factor<boolean>, currentEffort: Factor<number>, FutureEffort: Factor<number>, Dependencies: Factor<Action[]>) {
        this.id = id
        this.canRun = canRun
        this.currentEffort = currentEffort
        this.FutureEffort = FutureEffort
        this.Dependencies = Dependencies
    }

    // Executes the action
    abstract run(bot: Bot): void;

    // Stops the action if it's running
    protected abstract abortAction(bot: mineflayer.Bot): void 

    stop(bot: mineflayer.Bot): void {
        this.abortAction(bot)
        this.stopped = true
    }

    toJSON(): any {
        return this.id
    }
}