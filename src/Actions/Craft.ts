import { Bot } from 'mineflayer';
import Action from './Action';
import { Item } from 'prismarine-item';
import { Recipe, RecipeItem } from 'prismarine-recipe';
import { getItemNameById, getRecipes } from '../botHelper';
import Target from '../Targets/Target';
import OwnItem from '../Targets/OwnItem';
import BeNearBlock from '../Targets/BeNearBlock';

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
        ingrdient => new OwnItem(getItemNameById(bot, ingrdient.id), ingrdient.count)
      );
    }

    if (this.recipe.requiresTable) {
      const craftingTable = getCraftingTable(bot);

      if (!craftingTable) {
        return [new BeNearBlock('crafting_table')];
      }
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

  cancelAction(bot: Bot): void {
    bot.chat(`Canceled crafting ${getItemNameById(bot, this.recipe.result.id)}`);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getEffort(bot: Bot): number {
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
    maxDistance: 3
  }) ?? undefined;
}
