import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import {Entity} from "prismarine-entity";

export default class ClosestItemDrop extends MCFactor<Entity | null> {
    item: string
    constructor(item: string) {
        super("ClosestItemDrop" + item);
        this.item = item;
    }
    
    protected calc(bot: Bot): Entity | null {
        const entities = Object.values(bot.bot.entities);
        const itemDrops = entities.filter(entity => entity.type === 'other' && entity.entityType === 55)
        const itemId = bot.bot.registry.itemsByName[this.item as string].id
        var itemEntity = itemDrops.filter(entity => (entity.metadata[8] as {itemId: number}).itemId === itemId);
        itemEntity = itemEntity.sort((a, b) => a.position.distanceTo(bot.bot.entity.position) - b.position.distanceTo(bot.bot.entity.position));
        if (itemEntity.length === 0) return null
        return itemEntity[0];
    }
}