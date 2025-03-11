import { Recipe } from "prismarine-recipe";
import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import { recipeName } from "../../lib/utilities";

export default class CraftFutureEffort extends Factor<number> {
    recipe: Recipe

    constructor(recipe: Recipe) {
        super("CraftFutureEffort" + recipeName(recipe))
        this.recipe = recipe
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): number {
        if (this.recipe.requiresTable) {
            // return effort have placed crafting table
        }
        return 1 // makes crafting be priority
    }
}