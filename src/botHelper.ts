import { Bot } from "mineflayer";
import { Recipe } from 'prismarine-recipe';
import { Block } from 'prismarine-block';
import MinecraftData from 'minecraft-data';

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

export function findBlockByDropItemName(bot: Bot, itemName: string, maxDistance: number): Block | null {
  const blocks = getBlocksByDropItemName(bot, itemName);
  const blockIds = blocks.map(block => block.id)

  return bot.findBlock({
    matching: blockIds,
    maxDistance
  });
}

export function getBlocksByDropItemName(bot: Bot, itemName: string): MinecraftData.IndexedBlock[] {
  const itemId = getItemIdByName(bot, itemName);

  return Object.values(bot.registry.blocks)
    .filter(block => block.drops?.includes(itemId));
}
