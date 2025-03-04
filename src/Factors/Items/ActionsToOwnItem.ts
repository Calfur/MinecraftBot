import Action from "../../Actions/Action";
import Collect from "../../Actions/Collect/Collect";
import Craft from "../../Actions/Craft/Craft";
import { Mine } from "../../Actions/Mine/Mine";
import Bot from "../../Bot";
import Factor from "../Factor";
import mineflayer from "mineflayer";
import ItemCount from "./ItemCount";

export default class ActionsToOwnItem extends Factor<Action[]>{
    private item: string
    private count: number

    constructor(item: string, count: number = 1) {
        super("ActionsToOwnItem:" + item + count);
        this.item = item;
        this.count = count
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): Action[] {
        // TODO keep path to avoid infinite loop (probably needs to be part of id, maybe more seperation possible) //issue if 2 goals have opposit paths
        const remainingCount = this.count - get(new ItemCount(this.item));

        if (remainingCount <= 0) return [];

        const directActions: Action[] = [];
        const actions: Action[] = [];
        
        const recipes = bot.bot.recipesAll(bot.bot.registry.itemsByName[this.item].id, null, true)
        recipes.forEach(recipe => {
            directActions.push(new Craft(recipe));
        });

        //could make DigBlock search for blocks dropping this item instead of specific block
        this.blockTypesToMine(bot.bot, this.item).forEach(block => { 
            directActions.push(new Mine(block));
        });

        directActions.push(new Collect(this.item));

        //Add Dependencies
        actions.push(...directActions);
        for (const action of directActions) {
            actions.push(...get(action.Dependencies));
        }

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