import { Bot } from "mineflayer";
import Target from "./Target";
import Action from "../Actions/Action";
import Collect from "../Actions/Collect";
import Craft from "../Actions/Craft";
import { getBlocksByDropItemName, getRecipes } from "../botHelper";
import DigBlock from "../Actions/DigBlock";

export default class OwnItem implements Target {
  private itemName: string;
  private count: number;

  constructor(itemName: string, count: number) {
    this.itemName = itemName;
    this.count = count;
  }

  isCompleted(bot: Bot): boolean {
    const isCompleted = bot.inventory.items()
      .some(item => 
        item.name === this.itemName &&
        item.count >= this.count
      );

    if (isCompleted) {
      bot.chat(`Target completed - OwnItem: ${this.itemName}`);
    }

    return isCompleted;
  }

  getActions(bot: Bot): Action[] {
    const possibleActions: Action[] = [];

    const recipes = getRecipes(bot, this.itemName);
    recipes.forEach(recipe => {
      possibleActions.push(new Craft(recipe));
    });

    if (getBlocksByDropItemName(bot, this.itemName).length > 0) {
      possibleActions.push(new DigBlock(this.itemName));
    }

    possibleActions.push(new Collect(this.itemName));

    return possibleActions;
  }
}
