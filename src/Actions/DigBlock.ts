import { Bot } from "mineflayer";
import Target from "../Targets/Target";
import Action from "./Action";
import BeNearBlock from "../Targets/BeNearBlock";
import { findBlockByDropItemName } from "../botHelper";

const MAX_DIG_RANGE = 4;

export default class DigBlock implements Action {
  private dropItemName: string;
  private inProgress = false;

  constructor(dropItemName: string) {
    this.dropItemName = dropItemName;
  }

  getKey(): string {
    return `DigBlock:Drops:${this.dropItemName}`;
  }

  getMissingDependencies(bot: Bot): Target[] {
    // ToDo - Add tools

    const nearestBlock = findBlockByDropItemName(bot, this.dropItemName, MAX_DIG_RANGE);

    if (!nearestBlock) {
      return [new BeNearBlock(this.dropItemName)];
    }

    return [];
  }

  startAction(bot: Bot): void {
    this.inProgress = true;
    bot.chat(`Digging block ${this.dropItemName}`);

    const nearestBlock = findBlockByDropItemName(bot, this.dropItemName, MAX_DIG_RANGE);

    if(!nearestBlock) {
      throw new Error(`No block found: ${this.dropItemName}`);
    }

    bot.dig(nearestBlock).then(() => {
      this.inProgress = false;
    });
  }

  cancelAction(bot: Bot): void {
    bot.stopDigging();
    bot.chat(`Canceled Digging block ${this.dropItemName}`);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getEffort(bot: Bot): number {
    return 5;
  }
}
