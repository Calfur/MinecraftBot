import { Bot } from 'mineflayer';
import Action from './Action';
import { Item } from 'prismarine-item';
import { Recipe, RecipeItem } from 'prismarine-recipe';

export default class Craft implements Action {
  private itemName: string;

  constructor(itemName: string) {
    this.itemName = itemName;
  }

  public getMissingDependencies(bot: Bot): Action[] {
    const recipes = getRecipes(bot, this.itemName);

    const isAnyRecipeCraftable = recipes.filter(
      recipe => isRecipeCraftable(bot, recipe)
    ).length > 0;

    if (isAnyRecipeCraftable) {
      return [];
    }

    return recipes[0].ingredients
      .filter(ingredient => {
        const inventoryItems = bot.inventory.items();

        return !isIngredientInInventory(inventoryItems, ingredient);
      })
      .map(
        ingrdient => new Craft(getItemNameById(bot, ingrdient.id))
      );
  }

  public startAction(bot: Bot): void {
    const recipes = getRecipes(bot, this.itemName);

    const recipe = recipes.filter(
      recipe => isRecipeCraftable(bot, recipe)
    )[0];

    bot.craft(recipe, 1);
    bot.chat(`Crafting ${this.itemName}`);
  }

  public cancelAction(_: Bot): void { }
}

function getRecipes(bot: Bot, itemName: string) {
  const itemId = getItemIdByName(bot, itemName);

  const craftingTable = false;
  const recipes = bot.recipesAll(itemId, null, craftingTable);

  return recipes.filter(recipe => recipe.result.id === itemId);
}

function isRecipeCraftable(bot: Bot, recipe: Recipe): boolean {
  const inventoryItems = bot.inventory.items();

  return recipe.ingredients.every(
    ingredient => isIngredientInInventory(inventoryItems, ingredient)
  );
}

function isIngredientInInventory(inventoryItems: Item[], ingredient: RecipeItem): boolean {
  return inventoryItems.filter(
    inventoryItem => inventoryItem.type === ingredient.id &&
      inventoryItem.count >= ingredient.count
  ).length > 0;
}

function getItemIdByName(bot: Bot, itemName: string): number {
  return bot.registry.itemsByName[itemName].id;
}

function getItemNameById(bot: Bot, itemId: number): string {
  return bot.registry.items[itemId].name;
}
