import mineflayer from "mineflayer"
import Bot from "../Bot"
import MCFactor from "../Factors/MCFactor"

export default abstract class Action {
    id: string
    stopped = false
    canRun: MCFactor<boolean>
    currentEffort: MCFactor<number>
    FutureEffort: MCFactor<number>
    Dependencies: MCFactor<Action[]>
    
    constructor(id: string, canRun: MCFactor<boolean>, currentEffort: MCFactor<number>, FutureEffort: MCFactor<number>, Dependencies: MCFactor<Action[]>) {
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
}