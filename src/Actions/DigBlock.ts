import { Bot } from "mineflayer";
import Target from "../Targets/Target";
import Action from "./Action";
import BeNearBlock from "../Targets/BeNearBlock";
import { findBlockByDropItemName, getBlocksByDropItemName } from "../botHelper";
import OwnItem from "../Targets/OwnItem";

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

    const blocksWhichDropTheItem = getBlocksByDropItemName(bot, this.dropItemName);
    const firstBlockWithTools = blocksWhichDropTheItem.find(block => block.harvestTools && Object.keys(block.harvestTools).length > 0);
    if (firstBlockWithTools) {
      const requiredToolId = Number(Object.keys(firstBlockWithTools.harvestTools!)[0])
      const requiredToolName = bot.registry.items[requiredToolId].name;

      console.log(`Requires tools to dig block: ${this.dropItemName}, ${requiredToolName}`);

      return [new OwnItem(requiredToolName)];
    }

    const nearestBlock = findBlockByDropItemName(bot, this.dropItemName, MAX_DIG_RANGE);

    if (!nearestBlock) {
      return [new BeNearBlock(this.dropItemName)];
    }

    return [];
  }

  startAction(bot: Bot): void {
    this.inProgress = true;
    bot.chat(`Digging block which drops ${this.dropItemName}`);

    const nearestBlock = findBlockByDropItemName(bot, this.dropItemName, MAX_DIG_RANGE);

    if (!nearestBlock) {
      throw new Error(`No block found: ${this.dropItemName}`);
    }

    const tool = bot.pathfinder.bestHarvestTool(nearestBlock);

    const equipAndDig = async () => {
      try {
        if (tool) {
          await bot.equip(tool, 'hand');
        }
        await bot.dig(nearestBlock);
        bot.chat(`Successfully dug ${this.dropItemName}`);
      } catch (e) {
        console.error(e);
        bot.chat(`Exception while digging block which drops ${this.dropItemName}`);
      } finally {
        this.inProgress = false;
      }
    };
  
    equipAndDig();
  }

  cancelAction(bot: Bot): void {
    bot.stopDigging();
    bot.chat(`Canceled Digging block which drops ${this.dropItemName}`);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getEffort(bot: Bot): number {
    return 5;
  }
}
