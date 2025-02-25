import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Target from "./Target";
import Action from "./Action";
import TpsScoreboard from "./TpsScoreboard";
import FactorCache from "./Factors/FactorCache";
import TargetComplete from "./Factors/TargetComplete";

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

    if (remainingGoals.length > 0) {
      //2. get startable actions (cached)
      var actions = []
      for (const goal of remainingGoals) {
        // i think instead of having Actions and Targets, we have Factors and then later run Actions (Action only to run)

        // for goals get actions working towards it (action, importance (1-0))
        //
        // for actions get requirements
        // for requirements get actions working towards it

        // could keep path i think

        //maybe reduce redundant Actions
      }
      
      //3. start lowest effort action (not cached)

    }
      
    //4. check for status changes

    //5. do some calculations
    this.calcChanges(10);
  }
}