import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Action from "./Actions/Action";
import TpsScoreboard from "./TpsScoreboard";
import BestAction from "./Factors/BestAction";
import Factor from "./Factors/Factor";
import FactorCache from "./Factors/FactorCache";
import EventEmitter from "events";
import {plugin as collectBlock} from "mineflayer-collectblock";

export default class Bot extends EventEmitter {
  bot: mineflayer.Bot;
  neededActions: Factor<Action[]>[] = []; //Factors providing actions which should be done
  private currentAction?: Action | null;
  private tpsScoreboard?: TpsScoreboard;
  cache: FactorCache = new FactorCache();
  active: boolean;

  constructor(name: string, active: boolean = true) {
    super();
    this.active = active;

    this.bot = createBot({
      username: name,
    })

    this.bot.loadPlugin(pathfinder);
    this.bot.loadPlugin(collectBlock);

    this.bot.on('spawn', async () => {

      await this.bot.waitForTicks(1); // helps for loading some things

      this.bot.on('physicsTick', () => {
        if(!this.active) return
        this.tpsScoreboard?.tick();
        
        this.calcTick();
      });

      this.tpsScoreboard = new TpsScoreboard(this.bot);
    });

    this.bot.on('end', (reason) => {
      this.emit('end');
      this.emit('event', 'end:' + reason);
    });

    this.bot.on('error', (error: Error) => {
      this.emit('event', "error:" + error);
    });

    this.bot.on('kicked', () => {
      if(!this.active) return
      this.bot.connect({
        username: name
      });
    });
  }

  async calcTick() {
    if (!this.currentAction?.running) this.currentAction = null;

    //1. check if bestAction changed
    const bestAction = new BestAction().getValue(this.cache, this);
    if (bestAction === null) this.emit("finishedActions");

    if (bestAction?.id !== this.currentAction?.id) {
      this.currentAction?.stop(this.bot);
      this.currentAction = bestAction;
      if (this.currentAction) this.currentAction.runAction(this);
      this.bot.chat(`Run action: ${this.currentAction?.id}`);
    }
      
    //5. check for relevant status changes
    if (this.cache.changes.size === 0) { //low priority
      this.cache.addChange(/^ClosestItemDrop/)
      this.cache.addChange(/^ClosestBlock/)
      this.cache.addChange(/^ItemCount/)
    }

    //6. do some cache network calculations
    this.cache.calcChanges(10,this);
  }
}