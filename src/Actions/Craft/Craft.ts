import mineflayer from 'mineflayer'
import Action from '../../Action'
import { Recipe } from 'prismarine-recipe';
import { REACHDISTANCE } from '../../Constants';
import Bot from '../../Bot';

export default class Craft extends Action {
    recipe: Recipe
    count: number
    constructor(recipe: Recipe, count: number = 1) {
        super("Craft" + recipe.result.id + " " + count)
        this.recipe = recipe
        this.count = count
    }
    run(bot: Bot): void {
        if (this.recipe.requiresTable) {
            const crafting_table = bot.bot.findBlock({ matching: bot.bot.registry.blocksByName["crafting_table"].id, maxDistance: REACHDISTANCE })
            if (!crafting_table) return
            bot.bot.craft(this.recipe, this.count, crafting_table)
        } else {
            bot.bot.craft(this.recipe, this.count)
        }
    }
    
    abortAction(bot: mineflayer.Bot): void {
        return
    }
}