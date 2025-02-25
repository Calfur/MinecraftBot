import mineflayer from 'mineflayer'
import Action from '../Action'
import { Recipe } from 'prismarine-recipe';
import { REACHDISTANCE } from '../Constants';
import OwnItem from '../Targets/OwnItem';
import Bot from '../Bot';
import Target from '../Target';

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

    getEffortFuture(bot: Bot): number {
        return 0
    }

    getEffortNow(bot: mineflayer.Bot): number {
        return 0
    }

    getRequirements(bot: mineflayer.Bot): Target[] {
        // if (this.recipe.requiresTable) {
        //     return [new BlockNearby("crafting_table")]
        // }
        var requirements = []
        for (const item of this.recipe.delta.filter(item => item.count < 0)) {
            requirements.push(new OwnItem(bot.registry.items[item.id].name, -item.count * this.count / this.recipe.result.count))
        }
        return requirements
    }

    abortAction(bot: mineflayer.Bot): void {
        return
    }
}