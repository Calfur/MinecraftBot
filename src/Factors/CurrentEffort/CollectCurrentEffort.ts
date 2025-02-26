import Bot from "../../Bot";
import Factor from "../Factor";
import mineflayer from "mineflayer";
import { Entity } from 'prismarine-entity'

export default class CollectCurrentEffort extends Factor<number> {
    item: string
    constructor(item: string) {
        super("CollectCurrentEffort");
        this.item = item
    }

    calc(bot: Bot): number {
        const closestItem = this.getClosestItem(bot.bot);
        if (!closestItem) return Infinity
        return closestItem.position.distanceTo(bot.bot.entity.position)
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