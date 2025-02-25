import { Bot } from "mineflayer";
import Craft from "../Actions/Craft";
import Action from "../Action";
import { Recipe } from "prismarine-recipe";
import Target from "../Target";
import { Block } from "minecraft-data";

export default class OwnTool extends Target {
  private toolsFor: Block;
  private harvestTools: string[]

  constructor(toolsFor: Block) {
    super("OwnTool:for"+toolsFor.name);
    this.toolsFor = toolsFor;
    this.harvestTools = Object.keys(this.toolsFor.harvestTools ?? {});
  }

  isCompleted(bot: Bot): boolean {
    if (this.harvestTools.length === 0) return true
    for (const tool of this.harvestTools) {
      if (bot.inventory.count(tool, null) > 0) return true;
    }
    return false;
  }

  getActions(bot: Bot): Action[] {
    const actions: Action[] = [];

    const recipes: Recipe[] = [];

    for (const tool of this.harvestTools) {
      bot.recipesAll(bot.registry.itemsByName[tool].id, null, true)
    }

    // clear duplicat recipes
    recipes.forEach(recipe => {
      actions.push(new Craft(recipe));
    });

    return actions;
  }
}