import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Target from "./Target";
import Action from "./Action";
import TpsScoreboard from "./TpsScoreboard";
import FactorCache from "./Factors/FactorCache";

export const BLOCK_SEARCH_MAX_DISTANCE = 32;

export default class Bot extends FactorCache {
  bot: mineflayer.Bot;
  private goals: Target[];
  private currentAction?: Action | null;
  private tpsScoreboard?: TpsScoreboard;

  constructor(goals: Target[]) {
    super();
    this.goals = goals;

    this.bot = createBot({
      username: 'Hugo',
    })

    this.bot.loadPlugin(pathfinder)

    this.bot.on('spawn', () => {
      this.bot.chat(`/clear ${this.bot.username}`);// clear inventory to reset (mostly for testing purposes)

      this.bot.on('physicsTick', () => {
        this.tpsScoreboard?.tick();
  
        //1. check for incomplete actions (cached)

        //2. get startable actions (cached)

        //3. start lowest effort action (not cached)
  
      });

      this.tpsScoreboard = new TpsScoreboard(this.bot);
    });
  }
}