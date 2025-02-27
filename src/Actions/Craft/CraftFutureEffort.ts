import { Recipe } from "prismarine-recipe";
import Bot from "../../Bot";
import Factor from "../../Factors/Factor";

export default class CraftFutureEffort extends Factor<number> {
    recipe: Recipe

    constructor(recipe: Recipe) {
        super("CraftFutureEffort" + recipe.result.id)
        this.recipe = recipe
    }

    protected calc(bot: Bot): number {
        if (this.recipe.requiresTable) {
            // return effort have placed crafting table
        }
        return 1 // makes crafting be priority
    }
}