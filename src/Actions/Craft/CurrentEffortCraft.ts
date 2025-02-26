import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import {Recipe} from "prismarine-recipe";

export default class CurrentEffortCraft extends Factor<number> {
    recipe: Recipe
    constructor(recipe: Recipe) { //TODO maybe change to requires table
        super("CurrentEffortCraft");
        this.recipe = recipe
    }

    protected calc(bot: Bot): number {
        return 0
    }
}