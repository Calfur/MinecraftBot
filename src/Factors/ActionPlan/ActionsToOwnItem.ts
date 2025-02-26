import Action from "../../Action";
import Collect from "../../Actions/Collect";
import Craft from "../../Actions/Craft";
import { DigBlock } from "../../Actions/DigBlock";
import Bot from "../../Bot";
import CraftCanRun from "../canRun/CraftCanRun";
import Factor from "../Factor";
import mineflayer from "mineflayer";
import FutureEffortCraft from "../FutureEffort/FutureEffortCraft";
import CurrentEffortCraft from "../CurrentEffort/CurrentEffortCraft";
import MineCanRun from "../canRun/MineCanRun";
import FutureEffortMine from "../FutureEffort/FutureEffortMine";
import CurrentEffortMine from "../CurrentEffort/CurrentEffortMine";
import CollectCanRun from "../canRun/CollectCanRun";
import FutureEffortCollect from "../FutureEffort/FutureEffortCollect";
import CollectCurrentEffort from "../CurrentEffort/CollectCurrentEffort";

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
        const remainingCount = this.count - bot.bot.inventory.count(this.item, null);

        if (remainingCount <= 0) return [];

        const actions: {action: Action, canRun: boolean, effortFuture: number, effortNow: number}[] = [];

        const recipes = bot.bot.recipesAll(bot.bot.registry.itemsByName[this.item].id, null, true)

        recipes.forEach(recipe => {
            actions.push({
                action: new Craft(recipe, remainingCount), 
                canRun: this.get(new CraftCanRun(recipe)),
                effortFuture: this.get(new FutureEffortCraft(recipe)),
                effortNow: this.get(new CurrentEffortCraft(recipe))
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
                action: new DigBlock(block, this.item),
                canRun: this.get(new MineCanRun(block)),
                effortFuture: this.get(new FutureEffortMine(block, this.item)),
                effortNow: this.get(new CurrentEffortMine(block))
            });
            //TODO add Actions for tools
        });

        actions.push({
            action: new Collect(this.item),
            canRun: this.get(new CollectCanRun(this.item)),
            effortFuture: this.get(new FutureEffortCollect(this.item)),
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