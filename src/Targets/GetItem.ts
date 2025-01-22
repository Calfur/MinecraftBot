import { Bot } from "mineflayer";
import Target from "./Target";
import Action from "../Actions/Action";
import Collect from "../Actions/Collect";
import Craft from "../Actions/Craft";
import { getRecipes } from "../botHelper";
import { Item } from "prismarine-item";

export default class GetItem implements Target {
  private itemName: string;
  private completed = false;

  constructor(itemName: string) {
    this.itemName = itemName;
  }

  attatchCompletedListener(bot: Bot): void {
    const listener = (slot: number, oldItem: Item | null, newItem: Item | null) => {
      if (!newItem) return;
      if (newItem.name !== this.itemName) return;
      if (oldItem?.name === newItem.name && oldItem.count >= newItem.count) return;

      this.completed = true;
      bot.chat(`Target completed: GetItem:${this.itemName}`);
      bot.inventory.removeListener('updateSlot', listener);
    }
    bot.inventory.on('updateSlot', listener);
  }

  isCompleted(): boolean {
    return this.completed;
  }

  getActions(bot: Bot): Action[] {
    if (getRecipes(bot, this.itemName).length > 0) {
      return [new Craft(this.itemName)];
    }
  
    return [new Collect(this.itemName)];
  }
}