import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import {Recipe} from "prismarine-recipe";

export default class CraftCurrentEffort extends MCFactor<number> {
    recipe: Recipe
    constructor(recipe: Recipe) { //TODO maybe change to requires table
        super("CraftCurrentEffort" + recipe.delta.map(item => -item.count.toString() + "x" + item.id.toString()).join(","));
        this.recipe = recipe
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): number {
        return 0
    }
}