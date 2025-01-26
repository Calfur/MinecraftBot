import { Bot } from "mineflayer";
import Action from "../Actions/Action";
import Target from "./Target";
import WalkTo from "../Actions/WalkTo";

const COMPLETED_DISTANCE = 3;
const SEARCH_DISTANCE = 256;

export default class BeNearBlock implements Target {
  private blockName: string;

  constructor(blockName: string) {
    this.blockName = blockName;
  }

  isCompleted(bot: Bot): boolean {
    const isCompleted = !!bot.findBlock({
      matching: block => block.name.includes(this.blockName),
      maxDistance: COMPLETED_DISTANCE
    });

    if (isCompleted) {
      bot.chat(`Target completed - BeNearBlock: ${this.blockName}`);
    }

    return isCompleted;
  }

  getActions(bot: Bot): Action[] {
    const nearestBlock = bot.findBlock({
      matching: block => block.name.includes(this.blockName),
      maxDistance: SEARCH_DISTANCE
    });

    if (!nearestBlock) {
      // ToDo - Place block
      console.log(`No block found: ${this.blockName}`);

      return [];
    }

    return [new WalkTo(nearestBlock.position)];
  }
}
