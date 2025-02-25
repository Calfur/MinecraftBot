import mineflayer from "mineflayer";
import Craft from "../Actions/Craft";
import Target from "../Target";
import Action from "../Action";
import { DigBlock } from "../Actions/DigBlock";
import Collect from "../Actions/Collect";

export default class OwnItem extends Target {
  private itemName: string;
  private count: number

  constructor(itemName: string, count: number = 1) {
    super("OwnItem:" + itemName + count);
    this.itemName = itemName;
    this.count = count;
  }

  isCompleted(bot: mineflayer.Bot): boolean {
    return bot.inventory.count(this.itemName, null) >= this.count;
  }

  getActions(bot: mineflayer.Bot): Action[] {
    const actions: Action[] = [];

    const recipes = bot.recipesAll(bot.registry.itemsByName[this.itemName].id, null, true)

    // clear duplicat recipes

    recipes.forEach(recipe => {
      actions.push(new Craft(recipe, this.count));
    });

    this.blockTypesToMine(bot, this.itemName).forEach(block => {
      actions.push(new DigBlock(block, this.itemName));
    });

    actions.push(new Collect(this.itemName));

    return actions;
  }

  private blockTypesToMine(bot: mineflayer.Bot, itemName: string): string[] { //Maybe Export to lib
    const blocksToMine: string[] = []
    for (const block of Object.values(bot.registry.blockLoot)) {
        const blockDrops = block.drops.map(drop => drop.item)
        if (blockDrops.includes(itemName)) {
            blocksToMine.push(block.block)
        }
    }
    return blocksToMine
}
}