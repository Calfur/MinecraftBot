import { Bot } from "mineflayer";
import { Recipe } from 'prismarine-recipe';
import { Block } from 'prismarine-block';
import MinecraftData from 'minecraft-data';
import { BLOCK_SEARCH_MAX_DISTANCE } from "./Hugo";
import { Entity } from 'prismarine-entity'

export function getItemIdByName(bot: Bot, itemName: string): number {
  return bot.registry.itemsByName[itemName].id;
}

export function getItemNameById(bot: Bot, itemId: number): string {
  return bot.registry.items[itemId].name;
}

export function getRecipes(bot: Bot, itemName: string): Recipe[] {
  const itemId = getItemIdByName(bot, itemName);

  const craftingTable = true;
  const recipes = bot.recipesAll(itemId, null, craftingTable);

  return recipes.filter(recipe => recipe.result.id === itemId);
}

const noBlockFoundCache = new Map<string, number>()
const noBlockFoundCacheExpiry = 120000;
const distanceRequiredForNoBlockFoundCache = BLOCK_SEARCH_MAX_DISTANCE - 1;

export function findBlockByDropItemName(bot: Bot, itemName: string, maxDistance: number): Block | null {
  const now = Date.now();
  const expiry = noBlockFoundCache.get(itemName);
  if (expiry && expiry > now) return null;
  if (expiry && expiry <= now) noBlockFoundCache.delete(itemName);

  const blocks = getBlocksByDropItemName(bot, itemName);
  const blockIds = blocks.map(block => block.id);

  const block = bot.findBlock({
    matching: blockIds,
    maxDistance
  });

  if (!block) {
    if (maxDistance >= distanceRequiredForNoBlockFoundCache) {
      noBlockFoundCache.set(itemName, now + noBlockFoundCacheExpiry);
    }
    console.log(`Blocks not found: ${blocks.map(block => block.name).join(', ')}`);
  } else {
    console.log(`Found block: ${block.name}`);
  }

  return block;
}

export function getBlocksByDropItemName(bot: Bot, itemName: string): MinecraftData.IndexedBlock[] {
  const itemId = getItemIdByName(bot, itemName);

  return Object.values(bot.registry.blocks)
    .filter(block => block.drops?.includes(itemId));
}

export function getNearestItem(bot: Bot, itemName: string): Entity | null {
  const itemId = getItemIdByName(bot, itemName);

  return bot.nearestEntity((entity) =>
    entity.name === 'item' &&
    (entity.metadata[8] as any).itemId === itemId
  );
}
