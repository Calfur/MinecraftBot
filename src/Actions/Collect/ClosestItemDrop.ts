import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import {Entity} from "prismarine-entity";
import { asItemEntity } from "../../lib/utilities";

export default class ClosestItemDrop extends Factor<Entity | null> {
    item: string
    constructor(item: string) {
        super("ClosestItemDrop" + item);
        this.item = item;
    }
    
    protected calc(bot: Bot): Entity | null {
        // var itemEntity = filterItemEntities(Object.values(bot.bot.entities), bot.bot.registry.itemsByName[this.item as string].id);
        const entities = Object.values(bot.bot.entities);
        // const itemDrops = entities.filter(entity => entity.type === 'other' && entity.entityType === 55)
        const itemId = bot.bot.registry.itemsByName[this.item as string].id
        var itemEntity = entities.filter(entity => asItemEntity(entity)?.metadata[8].itemId === itemId);
        itemEntity = itemEntity.sort((a, b) => a.position.distanceTo(bot.bot.entity.position) - b.position.distanceTo(bot.bot.entity.position));
        if (itemEntity.length === 0) return null
        return itemEntity[0];
    }
}