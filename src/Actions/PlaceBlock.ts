import { Bot } from "mineflayer";
import Target from "../Targets/Target";
import Action from "./Action";
import OwnItem from "../Targets/OwnItem";
import { Vec3 } from "vec3";
import { getItemIdByName } from "../botHelper";

export default class PlaceBlock implements Action {
  private blockName: string;
  private inProgress = false;

  constructor(blockName: string) {
    this.blockName = blockName;
  }

  getKey(): string {
    return `PlaceBlock:${this.blockName}`;
  }

  getMissingDependencies(bot: Bot): Target[] {
    if (!bot.inventory.items().some(item => item.name === this.blockName)) {
      return [new OwnItem(this.blockName, 1)];
    };

    return [];
  }

  startAction(bot: Bot): void {
    this.inProgress = true;
    bot.chat(`Placing block: ${this.blockName}`);

    const itemId = getItemIdByName(bot, this.blockName);

    const referencePositions = bot.findBlocks({
      matching: block => block && block.boundingBox === 'block',
      maxDistance: 4,
      count: 50
    });

    if (referencePositions.length === 0) {
      throw new Error(`No block found to place a block on.`);
    }

    console.log(`${JSON.stringify(referencePositions)}`);

    const referenceBlock = referencePositions.filter(position => {
      return bot.blockAt(position.offset(0, 1, 0))?.name === 'air' && position.xyDistanceTo(bot.entity.position) > 2;
    })[0];

    const equipAndPlace = async () => {
      try {
        await bot.equip(itemId, 'hand');
        await bot.placeBlock(bot.blockAt(referenceBlock)!, new Vec3(0, 1, 0));
      } catch (e) {
        console.error(e);
        bot.chat(`Exception while placing block ${this.blockName}`);
      } finally {
        this.inProgress = false;
      }
    };

    equipAndPlace();
  }

  cancelAction(bot: Bot): void { }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getEffort(bot: Bot): number {
    return 1;
  }
}
