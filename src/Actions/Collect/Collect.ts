import mineflayer from "mineflayer";
import Action from "../Action";
import { Entity } from 'prismarine-entity'
import Bot from "../../Bot";
import { COLLECTDISTANCE } from "../../Constants";
import { goals } from "mineflayer-pathfinder";
import CollectCanRun from "./CollectCanRun";
import CollectCurrentEffort from "./CollectCurrentEffort";
import CollectFutureEffort from "./CollectFutureEffort";
import CollectDependencies from "./CollectDependencies";

export default class Collect extends Action {
  private item: string;

  constructor(item: string) {
    super("Collect" + item, new CollectCanRun(item), new CollectCurrentEffort(item), new CollectFutureEffort(item), new CollectDependencies(item));
    this.item = item;
  }

  run(bot: Bot): void {
    const closestItem = this.getClosestItem(bot.bot);
    if (!closestItem) {
      this.stopped = true
      bot.bot.chat('No items found ' + this.item)
      return
    } 

    bot.bot.pathfinder.goto(new goals.GoalNear(closestItem.position.x, closestItem.position.y, closestItem.position.z, COLLECTDISTANCE)).then(() => {
        this.stopped = true
    }).catch(() => {
        this.stopped = true
    })
  }

  abortAction(bot: mineflayer.Bot): void {
    bot.pathfinder.stop();
  }

  private getClosestItem(bot: mineflayer.Bot): Entity | undefined {
    const entities = Object.values(bot.entities);
    const itemDrops = entities.filter(entity => entity.type === 'other' && entity.entityType === 55)
    const itemId = bot.registry.itemsByName[this.item as string].id
    var itemEntity = itemDrops.filter(entity => (entity.metadata[8] as {itemId: number}).itemId === itemId);
    itemEntity = itemEntity.sort((a, b) => a.position.distanceTo(bot.entity.position) - b.position.distanceTo(bot.entity.position));
    if (itemEntity.length === 0) return undefined
    return itemEntity[0];
  }
}