import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import {Recipe} from "prismarine-recipe";
import ItemCount from "../../Factors/Items/ItemCount";

export default class CraftCanRun extends Factor<boolean> {
    recipe: Recipe
    constructor(recipe: Recipe) {
        super("CraftCanRun"+recipe.delta.map(item => -item.count.toString() + "x" + item.id.toString()).join(",")); //get name
        this.recipe = recipe
    }

    protected calc(bot: Bot): boolean {
        //TODO consider craftingtable
        for (const item of this.recipe.delta) {
            if (this.get(new ItemCount(bot.bot.registry.items[item.id].name)) < -item.count) {
                return false
            }
        }
        return true
    }
}
