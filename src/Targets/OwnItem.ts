import { Bot } from "mineflayer";
import Target from "./Target";
import Action from "../Actions/Action";
import Collect from "../Actions/Collect";
import Craft from "../Actions/Craft";
import { getRecipes } from "../botHelper";

export default class OwnItem implements Target {
  private itemName: string;

  constructor(itemName: string) {
    this.itemName = itemName;
  }

  isCompleted(bot: Bot): boolean {
    const isCompleted = bot.inventory.items()
      .some(item => item.name === this.itemName);

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

    possibleActions.push(new Collect(this.itemName));

    return possibleActions;
  }
}
