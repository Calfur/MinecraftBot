import mineflayer from 'mineflayer'
import Action from '../Action'
import { Recipe } from 'prismarine-recipe';
import { REACHDISTANCE } from '../../Constants';
import Bot from '../../Bot';
import CraftCanRun from './CraftCanRun';
import CraftCurrentEffort from './CraftCurrentEffort';
import CraftFutureEffort from './CraftFutureEffort';
import CraftDependencies from './CraftDependencies';

export default class Craft extends Action { //currently designed to only run it once
    recipe: Recipe
    
    constructor(recipe: Recipe) {
        super("Craft" + recipe.delta.map(item => -item.count.toString() + "x" + item.id.toString()).join(","), new CraftCanRun(recipe), new CraftCurrentEffort(recipe), new CraftFutureEffort(recipe), new CraftDependencies(recipe))
        this.recipe = recipe
    }
    run(bot: Bot): void {
        this.stopped = true //won't take more than 1 tick anyways
        if (this.recipe.requiresTable) {
            const crafting_table = bot.bot.findBlock({ matching: bot.bot.registry.blocksByName["crafting_table"].id, maxDistance: REACHDISTANCE })
            if (!crafting_table) return
            bot.bot.craft(this.recipe,1, crafting_table).catch(() => {
                console.log("failed to craft")
            })
        } else {
            bot.bot.craft(this.recipe,1).catch(() => {
                console.log("failed to craft")
            })
        }
    }
    
    abortAction(bot: mineflayer.Bot): void {
        return
    }
}