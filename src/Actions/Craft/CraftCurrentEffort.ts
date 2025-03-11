import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import {Recipe} from "prismarine-recipe";
import { recipeName } from "../../lib/utilities";

export default class CraftCurrentEffort extends Factor<number> {
    recipe: Recipe
    constructor(recipe: Recipe) { //TODO maybe change to requires table
        super("CraftCurrentEffort" + recipeName(recipe));
        this.recipe = recipe
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): number {
        return 0
    }
}