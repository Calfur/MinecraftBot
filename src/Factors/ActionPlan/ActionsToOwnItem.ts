import Action from "../../Action";
import Collect from "../../Actions/Collect";
import Craft from "../../Actions/Craft";
import { DigBlock } from "../../Actions/DigBlock";
import Bot from "../../Bot";
import Factor from "../Factor";
import mineflayer from "mineflayer";

export default class ActionsToOwnItem extends Factor<Action[]>{
    private item: string
    private count: number

    constructor(item: string, count: number = 1) {
        super("ActionsToOwnItem:" + item + count);
        this.item = item;
        this.count = count
    }

    calc(bot: Bot): Action[] {
        const remainingCount = this.count - bot.bot.inventory.count(this.item, null);

        if (remainingCount <= 0) return [];

        const actions: Action[] = [];

        const recipes = bot.bot.recipesAll(bot.bot.registry.itemsByName[this.item].id, null, true)

        // clear duplicat recipes

        recipes.forEach(recipe => {
            actions.push(new Craft(recipe, remainingCount));

            // Actions to obtain ingredients
            for (const item of recipe.delta.filter(item => item.count < 0)) {
                const actionsForIngredients = this.get(new ActionsToOwnItem(bot.bot.registry.items[item.id].name, remainingCount));
                actions.push(... actionsForIngredients);
            }
        });

        this.blockTypesToMine(bot.bot, this.item).forEach(block => {
            actions.push(new DigBlock(block, this.item));
            //TODO add Actions for tools
        });

        actions.push(new Collect(this.item));

        return actions;
    }

    private blockTypesToMine(bot: mineflayer.Bot, item: string): string[] { //Maybe Export to lib
        const blocksToMine: string[] = []
        for (const block of Object.values(bot.registry.blockLoot)) {
            const blockDrops = block.drops.map(drop => drop.item)
            if (blockDrops.includes(item)) {
                blocksToMine.push(block.block)
            }
        }
        return blocksToMine
    }
}