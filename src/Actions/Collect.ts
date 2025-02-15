import { Bot } from "mineflayer";
import Action from "./Action";
import { Entity } from 'prismarine-entity'
import { getItemNameById, getNearestItem } from "../botHelper";
import Target from "../Targets/Target";
import BeNearItem from "../Targets/BeNearItem";

export default class Collect implements Action {
  private itemName: string;
  private inProgress = false;

  constructor(
    itemName: string
  ) {
    this.itemName = itemName;
  }

  getKey(): string {
    return `Collect:${this.itemName}`;
  }

  getMissingDependencies(bot: Bot): Target[] {
    const nearestItem = getNearestItem(bot, this.itemName);
    if (nearestItem) {
      return [new BeNearItem(this.itemName)];
    }

    return [];
  }

  startAction(bot: Bot): void {
    this.inProgress = true;
    bot.chat(`Collecting ${this.itemName}`);

    const listener = (collector: Entity, collected: Entity) => {
      if (collector !== bot.entity) return;
      if (collected.name !== 'item') return;

      var itemId = (collected.metadata[8] as any).itemId;
      var itemName = getItemNameById(bot, itemId);

      if (itemName !== this.itemName) return;

      bot.chat(`Collected ${itemName}`);
      this.inProgress = false;
      bot.removeListener('playerCollect', listener);
    }
    bot.on('playerCollect', listener);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  cancelAction(bot: Bot): void {
    this.inProgress = false;
    bot.chat(`Canceled collecting ${this.itemName}`);
  }

  getEffort(bot: Bot): number {
    const nearestItem = getNearestItem(bot, this.itemName);

    if (nearestItem) {
      return bot.entity.position.distanceTo(nearestItem.position);
    }

    return 10000;
  }
}
