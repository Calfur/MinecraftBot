import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import ActionsToOwnItem from "../../Factors/Items/ActionsToOwnItem";
import Action from "../Action";
import {Recipe} from "prismarine-recipe";

export default class CraftDependencies extends Factor<Action[]> {
    recipe: Recipe

    constructor(recipe: Recipe) {
        super("CraftDependencies" + recipe.delta.map(item => item.count.toString() + "x" + item.id.toString()).join(","))
        this.recipe = recipe
    }

    calc(bot: Bot): Action[] {
        var actions = []
        for (const item of this.recipe.delta.filter(item => item.count < 0)) {
            const actionsForIngredients = this.get(new ActionsToOwnItem(bot.bot.registry.items[item.id].name, -item.count));
            actions.push(... actionsForIngredients);
        }
        return actions
    }
}
