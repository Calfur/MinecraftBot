import { Recipe } from "prismarine-recipe";
import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";

export default class CraftFutureEffort extends MCFactor<number> {
    recipe: Recipe

    constructor(recipe: Recipe) {
        super("CraftFutureEffort" + recipe.delta.map(item => -item.count.toString() + "x" + item.id.toString()).join(","))
        this.recipe = recipe
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): number {
        if (this.recipe.requiresTable) {
            // return effort have placed crafting table
        }
        return 1 // makes crafting be priority
    }
}