import { Bot } from "mineflayer";

export function getItemIdByName(bot: Bot, itemName: string): number {
  return bot.registry.itemsByName[itemName].id;
}

export function getItemNameById(bot: Bot, itemId: number): string {
  return bot.registry.items[itemId].name;
}
