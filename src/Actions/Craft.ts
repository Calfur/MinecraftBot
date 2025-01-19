import { Bot } from 'mineflayer';
import Action from './Action';
import { Item } from 'prismarine-item';
import { Recipe, RecipeItem } from 'prismarine-recipe';
import { getItemNameById, getRecipes } from '../botHelper';
import Target from '../Targets/Target';
import GetItem from '../Targets/GetItem';

export default class Craft implements Action {
  private itemName: string;

  constructor(
    itemName: string
  ) {
    this.itemName = itemName;
  }

  getKey(): string {
    return `Craft:${this.itemName}`;
  }

  getMissingDependencies(bot: Bot): Target[] {
    const recipes = getRecipes(bot, this.itemName);

    const isAnyRecipeCraftable = recipes.filter(
      recipe => isRecipeCraftable(bot, recipe)
    ).length > 0;

    if (isAnyRecipeCraftable) {
      return [];
    }

    const inventoryItems = bot.inventory.items();
    const missingItems = getRequiredItemsToCraft(recipes[0])
      .filter(recipeItem => !isRecipeItemInInventory(inventoryItems, recipeItem));

    return missingItems.map(
      ingrdient => new GetItem(getItemNameById(bot, ingrdient.id))
    );
  }

  isInProgress(): boolean {
    return false;
  }

  startAction(bot: Bot): void {
    const recipes = getRecipes(bot, this.itemName);

    const recipe = recipes.filter(
      recipe => isRecipeCraftable(bot, recipe)
    )[0];

    bot.chat(`Crafting ${this.itemName}`);
    bot.craft(recipe, 1);
  }

  cancelAction(_: Bot): void { }
}

function isRecipeCraftable(bot: Bot, recipe: Recipe): boolean {
  const inventoryItems = bot.inventory.items();

  return getRequiredItemsToCraft(recipe)
    .every(
      recipeItem => isRecipeItemInInventory(inventoryItems, recipeItem)
    );
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
