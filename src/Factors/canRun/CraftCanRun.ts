import Bot from "../../Bot";
import Factor from "../Factor";
import {Recipe} from "prismarine-recipe";

export default class CraftCanRun extends Factor<boolean> {
    recipe: Recipe
    constructor(recipe: Recipe, goal: string) {
        super("CraftCanRun"+goal);
        this.recipe = recipe
    }

    protected calc(bot: Bot): boolean {
        //TODO consider craftingtable
        for (const item of this.recipe.delta) {
            if (bot.bot.inventory.count(item.id, null) < -item.count) {
                return false
            }
        }
        return true
    }
}
