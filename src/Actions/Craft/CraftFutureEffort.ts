import { Recipe } from "prismarine-recipe";
import Bot from "../../Bot";
import Factor from "../../Factors/Factor";

export default class CraftFutureEffort extends Factor<number> {
    recipe: Recipe
    count: number

    constructor(recipe: Recipe, count: number = 1) {
            super("CraftFutureEffort" + recipe.result.id + " " + count)
            this.recipe = recipe
            this.count = count
        }

    protected calc(bot: Bot): number {
        if (this.recipe.requiresTable) {
            // return effort have placed crafting table
        }
        return 0
    }
}