import mineflayer from "mineflayer"
import FactorCache from "./Factors/FactorCache"
import { Entity } from "prismarine-entity"
import { asItemEntity } from "./lib/utilities";

export default function registerChanges(bot: mineflayer.Bot, cache: FactorCache): void {
    bot.on('playerCollect', (collector: Entity, collected: Entity) => {
    const item: string = bot.registry.items[asItemEntity(collected)?.metadata[8].itemId!].name;
        if (collector === bot.entity) {
            cache.addChangeRegEx(new RegExp(`^ItemCount${item}`), 1)
        };
        cache.addChangeRegEx(new RegExp(`^ClosestItemDrop${item}`), 1)
    });

    bot.on('respawn', () => {
        cache.addChangeRegEx(/.*/, 1)
    });

    bot.on('spawn', () => {
        cache.addChangeRegEx(/.*/, 1)
    });
}