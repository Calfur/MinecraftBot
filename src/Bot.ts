import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Action from "./Actions/Action";
import TpsScoreboard from "./TpsScoreboard";
import BestAction from "./Factors/BestAction";
import Factor from "./Factors/Factor";
import FactorCache from "./Factors/FactorCache";
import EventEmitter from "events";

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

    this.bot.loadPlugin(pathfinder)

    this.bot.on('spawn', async () => {

      await this.bot.waitForTicks(1); // helps for loading some things

      this.bot.on('physicsTick', () => {
        if(!this.active) return
        this.tpsScoreboard?.tick();
        
        this.calcTick();
      });

      this.tpsScoreboard = new TpsScoreboard(this.bot);
    });

    this.bot.once('end', () => {
      this.emit('end');
    });
  }

  calcTick() {
    // console.timeEnd("mineflayer");
    // console.time("other"); //max registered time: 0.1ms

    if (this.currentAction?.stopped) this.currentAction = null;

    //1. check if bestAction changed
    const bestAction = new BestAction().getValue(this.cache, this);
    if (bestAction === null) this.emit("finishedActions");

    if (bestAction?.id !== this.currentAction?.id) {
      this.currentAction?.stop(this.bot);
      this.currentAction = bestAction;
      if (this.currentAction) this.currentAction.run(this);
      this.bot.chat(`Running action: ${this.currentAction?.id}`);
    }
      
    //5. check for relevant status changes
    if (this.cache.changes.size === 0) { //low priority
      this.cache.addChange("ClosestItemDrop")//check for drops
      this.cache.addChange("ClosestBlock")//check for blocks
      this.cache.addChange("ItemCount")//check for items in inventory
    }
    // console.timeEnd("other");

    //6. do some cache network calculations

    // console.time("calcChanges"); //often around 80ms for 32 range
    this.cache.calcChanges(10,this);
    // console.timeEnd("calcChanges");

    // console.time("mineflayer"); //max registered time: 4ms
  }


}