import { Bot } from "mineflayer";
import { Recipe } from 'prismarine-recipe';

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
