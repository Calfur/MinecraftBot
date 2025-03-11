import mineflayer from "mineflayer"
import FactorCache from "./Factors/FactorCache"
import { Entity } from "prismarine-entity"
import { Block } from "prismarine-block"
import { asItemEntity } from "./lib/utilities";

export default function registerChanges(bot: mineflayer.Bot, cache: FactorCache): void {
    bot.on('playerCollect', (collector: Entity, collected: Entity) => {
        const item: string = bot.registry.items[asItemEntity(collected)?.metadata[8].itemId!].name;
        if (collector === bot.entity) {
            cache.addChange(`ItemCount${item}`, 1)
        };
        const distance = collector.position.distanceTo(bot.entity.position);
        cache.addChange(`ClosestItemDrop${item}`, 10 / distance) //relevance depends on how close the drop is compared to others
    });

    bot.on('itemDrop', (entity: Entity) => {
        const item: string = bot.registry.items[asItemEntity(entity)?.metadata[8].itemId!].name;
        const distance = entity.position.distanceTo(bot.entity.position);
        cache.addChange(`ItemCount${item}`, 1)
        cache.addChange(`ClosestItemDrop${item}`, 10 / distance) //relevance depends on how close the drop is compared to others
    })

    // bot.on('diggingCompleted', (block: Block) => { //returns air instead of actual block
    //     cache.addChange(`ClosestBlock${block.name}`, 1);
    //     if (bot.registry.blockLoot[block.name]) {
    //         for (const drop of bot.registry.blockLoot[block.name].drops.map(drop => drop.item)) {
    //             cache.addChange(`ClosestItemDrop${drop}`, 1)
    //         }
    //     }
    // });

    bot.on('respawn', () => {
        cache.addChangeRegEx(/.*/, 1)
    });

    bot.on('spawn', () => {
        cache.addChangeRegEx(/.*/, 1)
    });

    bot.on('forcedMove', () => {
        cache.addChangeRegEx(/^ClosestItemDrop/, 1)
        cache.addChangeRegEx(/^ClosestBlock/, 1)
    });
}