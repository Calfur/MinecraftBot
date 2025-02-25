import { Bot } from "mineflayer";
import Action from "../Actions/Action";
import Target from "./Target";
import WalkTo from "../Actions/WalkTo";
import { findBlockByDropItemName } from "../botHelper";
import { BLOCK_SEARCH_MAX_DISTANCE } from "../Hugo";
import PlaceBlock from "../Actions/PlaceBlock";

const COMPLETED_DISTANCE = 3;
const SEARCH_MAX_DISTANCE = BLOCK_SEARCH_MAX_DISTANCE;

export default class BeNearBlock implements Target {
  private dropItemName: string;

  constructor(dropItemName: string) {
    this.dropItemName = dropItemName;
  }

  isCompleted(bot: Bot): boolean {
    const isCompleted = !!findBlockByDropItemName(bot, this.dropItemName, COMPLETED_DISTANCE);

    if (isCompleted) {
      bot.chat(`Target completed - BeNearBlock which drops: ${this.dropItemName}`);
    }

    return isCompleted;
  }

  getActions(bot: Bot): Action[] {
    const nearestBlock = findBlockByDropItemName(bot, this.dropItemName, SEARCH_MAX_DISTANCE);

    if (nearestBlock) {
      return [new WalkTo(nearestBlock.position, COMPLETED_DISTANCE - 1)];
    }

    return [new PlaceBlock(this.dropItemName)];
  }
}
