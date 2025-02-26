import Action from "../../Action";
import Collect from "../../Actions/Collect/Collect";
import Craft from "../../Actions/Craft/Craft";
import { Mine } from "../../Actions/Mine/Mine";
import Bot from "../../Bot";
import CraftCanRun from "../../Actions/Craft/CraftCanRun";
import Factor from "../Factor";
import mineflayer from "mineflayer";
import CraftFutureEffort from "../../Actions/Craft/CraftFutureEffort";
import CraftCurrentEffort from "../../Actions/Craft/CraftCurrentEffort";
import MineCanRun from "../../Actions/Mine/MineCanRun";
import MineFutureEffort from "../../Actions/Mine/MineFutureEffort";
import MineCurrentEffort from "../../Actions/Mine/MineCurrentEffort";
import CollectCanRun from "../../Actions/Collect/CollectCanRun";
import CollectFutureEffort from "../../Actions/Collect/CollectFutureEffort";
import CollectCurrentEffort from "../../Actions/Collect/CollectCurrentEffort";
import ItemCount from "./ItemCount";

export default class ActionsToOwnItem extends Factor<{action: Action, canRun: boolean, effortFuture: number, effortNow: number}[]>{
    private item: string
    private count: number

    constructor(item: string, count: number = 1) {
        super("ActionsToOwnItem:" + item + count);
        this.item = item;
        this.count = count
    }

    protected calc(bot: Bot): {action: Action, canRun: boolean, effortFuture: number, effortNow: number}[] {
        // TODO keep path to avoid infinite loop (probably needs to be part of id, maybe more seperation possible)
        const remainingCount = this.count - this.get(new ItemCount(this.item));

        if (remainingCount <= 0) return [];

        const actions: {action: Action, canRun: boolean, effortFuture: number, effortNow: number}[] = [];

        const recipes = bot.bot.recipesAll(bot.bot.registry.itemsByName[this.item].id, null, true)

        recipes.forEach(recipe => {
            actions.push({
                action: new Craft(recipe, remainingCount), 
                canRun: this.get(new CraftCanRun(recipe,this.item)),
                effortFuture: this.get(new CraftFutureEffort(recipe)),
                effortNow: this.get(new CraftCurrentEffort(recipe))
            });

            // Actions to obtain ingredients
            for (const item of recipe.delta.filter(item => item.count < 0)) {
                const actionsForIngredients = this.get(new ActionsToOwnItem(bot.bot.registry.items[item.id].name, remainingCount));
                actions.push(... actionsForIngredients);
            }
        });

        //could make DigBlock search for blocks dropping this item instead of specific block
        this.blockTypesToMine(bot.bot, this.item).forEach(block => { 
            actions.push({
                action: new Mine(block, this.item),
                canRun: this.get(new MineCanRun(block)),
                effortFuture: this.get(new MineFutureEffort(block, this.item)),
                effortNow: this.get(new MineCurrentEffort(block))
            });
            //TODO add Actions for tools
        });

        actions.push({
            action: new Collect(this.item),
            canRun: this.get(new CollectCanRun(this.item)),
            effortFuture: this.get(new CollectFutureEffort(this.item)),
            effortNow: this.get(new CollectCurrentEffort(this.item))
        });

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