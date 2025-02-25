import mineflayer from "mineflayer";
import Action from "./Action";
import Bot from "./Bot";

export default abstract class Target {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
  abstract isCompleted(bot: mineflayer.Bot): boolean;
  //ways to fullfill the target
  abstract getActions(bot: mineflayer.Bot): Action[];

  getTotalEffortFuture(bot: Bot): number {
    return Math.min(...this.getActions(bot.bot).map((action) => action.getTotalEffortFuture(bot)))
  }

  getActionImportance(bot: Bot, importance: number): [Action, number][] {
    
    const actions: Action[] = this.getActions(bot.bot)
    
    const actionEffort: [Action, number][] = actions.map((action) => [action, action.getTotalEffortFuture(bot)])
    
    const lowestEffort: number = Math.min(...actionEffort.map((effort) => effort[1]))
    
    const actionGain: [Action, number][] = actionEffort.map((effort) => [effort[0], importance * (1 / (effort[1] / lowestEffort))]) // Importance is reduced if effort is higher than lowest one, maybe 1 / Math.pow(effort[1] / lowestEffort, 2)
    
    for (const action of actionGain) {
      if (!action[0].canRun(bot.bot)) {
        for (const requirement of action[0].getRequirements(bot.bot)) {
          actionGain.push(...requirement.getActionImportance(bot, action[1]))
        }
      }
    }
    
    return actionGain.filter((action) => action[0].canRun(bot.bot))
  }
}