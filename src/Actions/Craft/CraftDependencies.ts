import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import ActionsToOwnItem from "../../Factors/Items/ActionsToOwnItem";
import Action from "../Action";
import {Recipe} from "prismarine-recipe";

export default class CraftDependencies extends MCFactor<Action[]> {
    recipe: Recipe

    constructor(recipe: Recipe) {
        super("CraftDependencies" + recipe.delta.map(item => -item.count.toString() + "x" + item.id.toString()).join(","))
        this.recipe = recipe
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): Action[] {
        var actions = []
        for (const item of this.recipe.delta.filter(item => item.count < 0)) {
            const actionsForIngredients = get(new ActionsToOwnItem(bot.bot.registry.items[item.id].name, -item.count));
            actions.push(... actionsForIngredients);
        }
        return actions
    }
}
