import MCFactor from "../../Factors/MCFactor";
import {Recipe} from "prismarine-recipe";
import ItemCount from "../../Factors/Items/ItemCount";
import Bot from "../../Bot";

export default class CraftCanRun extends MCFactor<boolean> {
    recipe: Recipe
    constructor(recipe: Recipe) {
        super("CraftCanRun"+recipe.delta.map(item => -item.count.toString() + "x" + item.id.toString()).join(",")); //get name
        this.recipe = recipe
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): boolean {
        //TODO consider craftingtable
        for (const item of this.recipe.delta) {
            if (get(new ItemCount(bot.bot.registry.items[item.id].name)) < -item.count) {
                return false
            }
        }
        return true
    }
}
