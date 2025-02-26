import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import {Recipe} from "prismarine-recipe";

export default class CraftCurrentEffort extends Factor<number> {
    recipe: Recipe
    constructor(recipe: Recipe) { //TODO maybe change to requires table
        super("CraftCurrentEffort");
        this.recipe = recipe
    }

    protected calc(bot: Bot): number {
        return 0
    }
}