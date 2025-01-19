import { Bot } from 'mineflayer';
import Action from './Action';
import { Item } from 'prismarine-item';
import { Recipe, RecipeItem } from 'prismarine-recipe';
import Collect from './Collect';
import { getItemIdByName, getItemNameById } from '../botHelper';

export default class Craft implements Action {
  private itemName: string;

  constructor(itemName: string) {
    this.itemName = itemName;
  }

  getMissingDependencies(bot: Bot): Action[] {
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
      ingrdient => getAction(bot, ingrdient)
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

    bot.craft(recipe, 1);
    bot.chat(`Crafting ${this.itemName}`);
  }

  cancelAction(_: Bot): void { }
}

function getRecipes(bot: Bot, itemName: string): Recipe[] {
  const itemId = getItemIdByName(bot, itemName);

  const craftingTable = false;
  const recipes = bot.recipesAll(itemId, null, craftingTable);

  return recipes.filter(recipe => recipe.result.id === itemId);
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
      inventoryItem.count >= recipeItem.count
  ).length > 0;
}

function getAction(bot: Bot, ingrdient: RecipeItem): Action {
  const itemName = getItemNameById(bot, ingrdient.id);

  if (getRecipes(bot, itemName).length > 0) {
    return new Craft(itemName);
  }

  return new Collect(itemName);
}

function getRequiredItemsToCraft(recipe: Recipe): RecipeItem[] {
  return recipe.delta
    .filter(d => d.count < 0);
}
