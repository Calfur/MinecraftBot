import { Bot } from 'mineflayer';
import Action from './Action';
import { Item } from 'prismarine-item';
import { Recipe, RecipeItem } from 'prismarine-recipe';
import { getItemNameById, getRecipes } from '../botHelper';
import Target from '../Targets/Target';
import GetItem from '../Targets/GetItem';

export default class Craft implements Action {
  private recipe: Recipe;
  private inProgress = false;

  constructor(
    recipe: Recipe
  ) {
    this.recipe = recipe;
  }

  getKey(): string {
    return `Craft:${this.recipe.result.id}`;
  }

  getMissingDependencies(bot: Bot): Target[] {
    const inventoryItems = bot.inventory.items();
    const missingItems = getRequiredItemsToCraft(this.recipe)
      .filter(recipeItem => !isRecipeItemInInventory(inventoryItems, recipeItem));

    if (missingItems.length !== 0) {
      return missingItems.map(
        ingrdient => new GetItem(getItemNameById(bot, ingrdient.id))
      );
    }

    if (this.recipe.requiresTable) {
      const craftingTable = getCraftingTable(bot);

      if (!craftingTable) {
        throw new Error('No nearby crafting table found');
        // ToDo add nearby crafting table target
      }

      return [];
    }

    return [];
  }

  startAction(bot: Bot): void {
    this.inProgress = true;
    bot.chat(`Crafting ${getItemNameById(bot, this.recipe.result.id)}`);

    const craftingTable = getCraftingTable(bot);
    bot.craft(this.recipe, 1, craftingTable).then(() => {
      this.inProgress = false;
    });
  }

  cancelAction(_: Bot): void { }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getEffort(): number {
    return 0;
  }
}

function isRecipeItemInInventory(inventoryItems: Item[], recipeItem: RecipeItem): boolean {
  return inventoryItems.filter(
    inventoryItem =>
      inventoryItem.type === recipeItem.id &&
      inventoryItem.count >= Math.abs(recipeItem.count)
  ).length > 0;
}

function getRequiredItemsToCraft(recipe: Recipe): RecipeItem[] {
  return recipe.delta
    .filter(d => d.count < 0);
}

function getCraftingTable(bot: Bot) {
  return bot.findBlock({
    matching: block => block.name.includes('crafting_table'),
    maxDistance: 6
  }) ?? undefined;
}
