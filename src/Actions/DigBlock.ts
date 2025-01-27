import { Bot } from "mineflayer";
import Target from "../Targets/Target";
import Action from "./Action";
import BeNearBlock from "../Targets/BeNearBlock";

const SEARCH_DISTANCE = 4;

export default class DigBlock implements Action {
  private blockName: string;
  private inProgress = false;

  constructor(blockName: string) {
    this.blockName = blockName;
  }

  getKey(): string {
    return `DigBlock:${this.blockName}`;
  }

  getMissingDependencies(bot: Bot): Target[] {
    // ToDo - Add tools

    const nearestBlock = bot.findBlock({
      matching: block => block.name.includes(this.blockName),
      maxDistance: SEARCH_DISTANCE
    });

    if (!nearestBlock) {
      return [new BeNearBlock(this.blockName)];
    }

    return [];
  }

  startAction(bot: Bot): void {
    this.inProgress = true;
    bot.chat(`Digging block ${this.blockName}`);

    const nearestBlock = bot.findBlock({
      matching: block => block.name.includes(this.blockName),
      maxDistance: SEARCH_DISTANCE
    });

    if(!nearestBlock) {
      throw new Error(`No block found: ${this.blockName}`);
    }

    bot.dig(nearestBlock).then(() => {
      this.inProgress = false;
    });
  }

  cancelAction(bot: Bot): void {
    bot.stopDigging();
    bot.chat(`Canceled Digging block ${this.blockName}`);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getEffort(bot: Bot): number {
    return 5;
  }
}
