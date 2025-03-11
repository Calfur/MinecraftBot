import mineflayer from "mineflayer"
import Bot from "../Bot"
import Factor from "../Factors/Factor"

export default abstract class Action {
    id: string
    running = false
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
    protected abstract run(bot: Bot): void;

    runAction(bot: Bot): void {
        this.running = true
        this.run(bot)
    }

    // Stops the action if it's running
    protected abstract abortAction(bot: mineflayer.Bot): void 

    stop(bot: mineflayer.Bot) {
        this.abortAction(bot)
        this.running = false
    }

    protected fail(bot: Bot, reason: string): void {
        this.running = false
        bot.emit("event", this.id, reason)
        this.registerChanges(bot)
    }

    protected success(bot: Bot): void {
        this.running = false
        bot.emit("event", this.id, "finished successfully")
        this.registerChanges(bot)
    }

    toJSON(): any {
        return this.id
    }

    abstract registerChanges(bot: Bot): void // factors which are related to the action which are likely changed
    // maybe change to update factors on events
}