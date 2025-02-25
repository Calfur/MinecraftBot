import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Target from "./Target";
import Action from "./Action";
import TpsScoreboard from "./TpsScoreboard";
import FactorCache from "./Factors/FactorCache";
import BestAction from "./Factors/BestAction";
import Factor from "./Factors/Factor";

export const BLOCK_SEARCH_MAX_DISTANCE = 32;

export default class Bot extends FactorCache {
  bot: mineflayer.Bot;
  goals: Factor<Action[]>[] = []; //Factors providing actions which should be done
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
    //1. check if bestAction changed
    const bestAction = new BestAction(this).calc(this);

    if (bestAction !== this.currentAction) {
      this.currentAction?.stop(this.bot);
      this.currentAction = bestAction;
      if (this.currentAction) this.currentAction.run(this);
      this.bot.chat(`Running action: ${this.currentAction?.id}`);
    }
      
    //5. check for relevant status changes

    //6. do some cache network calculations
    this.calcChanges(10);
  }
}