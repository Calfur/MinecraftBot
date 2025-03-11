import Factor from "../../Factors/Factor";
import {Recipe} from "prismarine-recipe";
import ItemCount from "../../Factors/Items/ItemCount";
import Bot from "../../Bot";
import { recipeName } from "../../lib/utilities";

export default class CraftCanRun extends Factor<boolean> {
    recipe: Recipe
    constructor(recipe: Recipe) {
        super("CraftCanRun" + recipeName(recipe)); //get name
        this.recipe = recipe
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): boolean {
        //TODO consider craftingtable
        for (const item of this.recipe.delta) {
            if (get(new ItemCount(bot.bot.registry.items[item.id].name)) < -item.count) {
                return false
            }
        }
        return true
    }
}
