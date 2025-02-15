import { Bot } from "mineflayer";
import Target from "./Target";
import { getNearestItem } from "../botHelper";
import Action from "../Actions/Action";
import WalkTo from "../Actions/WalkTo";

const COMPLETED_DISTANCE = 0.5;

export default class BeNearItem implements Target {
  private itemName: string;

  constructor(itemName: string) {
    this.itemName = itemName;
  }

  isCompleted(bot: Bot): boolean {
    const nearestItem = getNearestItem(bot, this.itemName);

    const isCompleted = !!nearestItem && bot.entity.position.distanceTo(nearestItem.position) < COMPLETED_DISTANCE;

    if (isCompleted) {
      bot.chat(`Target completed - BeNearItem: ${this.itemName}`);
    }

    return isCompleted;
  }

  getActions(bot: Bot): Action[] {
    const nearestItem = getNearestItem(bot, this.itemName);

    if (nearestItem) {
      return [new WalkTo(nearestItem.position, COMPLETED_DISTANCE - 0.1)];
    }

    return [];
  }
}