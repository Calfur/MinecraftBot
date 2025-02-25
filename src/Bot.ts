import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Target from "./Target";
import Action from "./Action";
import TpsScoreboard from "./TpsScoreboard";
import FactorCache from "./Factors/FactorCache";
import TargetComplete from "./Factors/CompletionFactors/TargetComplete";

export const BLOCK_SEARCH_MAX_DISTANCE = 32;

export default class Bot extends FactorCache {
  bot: mineflayer.Bot;
  goals: Target[] = [];
  private currentAction?: Action | null;
  private tpsScoreboard?: TpsScoreboard;

  constructor(name: string) {
    super();

    this.bot = createBot({
      username: name,
    })

    this.bot.loadPlugin(pathfinder)

    this.bot.on('spawn', () => {
      this.bot.chat(`/clear ${this.bot.username}`);// clear inventory to reset (mostly for testing purposes)

      this.bot.on('physicsTick', () => {
        this.tpsScoreboard?.tick();
  
        this.calcTick();
      });

      this.tpsScoreboard = new TpsScoreboard(this.bot);
    });
  }

  calcTick() {
    //1. check for incomplete actions (cached)
    const remainingGoals = this.goals.filter((goal) => !new TargetComplete(goal).getValue(this));
    this.bot.chat(`Remaining goals: ${remainingGoals.length}`);

    //2. get startable actions (cached)

    //3. start lowest effort action (not cached)

    //4. check for status changes

    //5. do some calculations
    this.calcChanges(10);
  }
}