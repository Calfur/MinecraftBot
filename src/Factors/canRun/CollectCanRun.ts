import Bot from "../../Bot";
import Factor from "../Factor";
import mineflayer from "mineflayer";
import { Entity } from 'prismarine-entity'

export default class CollectCanRun extends Factor<boolean> {
    item: string
    constructor(item: string) {
        super("CollectCanRun"+item);
        this.item = item
    }

    calc(bot: Bot): boolean {
        return this.getClosestItem(bot.bot) !== undefined
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
