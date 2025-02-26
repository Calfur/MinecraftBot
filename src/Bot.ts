import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Action from "./Action";
import TpsScoreboard from "./TpsScoreboard";
import BestAction from "./Factors/BestAction";
import Factor from "./Factors/Factor";

export default class Bot {
  bot: mineflayer.Bot;
  neededActions: Factor<{action: Action, canRun: boolean, effortFuture: number, effortNow: number}[]>[] = []; //Factors providing actions which should be done
  private currentAction?: Action | null;
  private tpsScoreboard?: TpsScoreboard;
  cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
  dependents: { [key: string]: Set<string> } = {}; // Factors which depend on the Key factor (used to check for factors which need to be recalculated)
  dependencies: { [key: string]: Set<string> } = {}; // Factors on which the Key Factor depends on (used to remove dependencies)
  changes: Set<string> = new Set<string>(); // Factors which need to be recalculated due to assumed changes
  ticks: number = 0;

  constructor(name: string) {
    this.bot = createBot({
      username: name,
    })

    this.bot.loadPlugin(pathfinder)

    this.bot.on('spawn', async () => {
      this.bot.chat(`/clear ${this.bot.username}`);// clear inventory to reset (mostly for testing purposes)

      await this.bot.waitForTicks(1);

      this.bot.on('physicsTick', () => {
        this.tpsScoreboard?.tick();
  
        this.calcTick();
        this.ticks++;
      });

      this.tpsScoreboard = new TpsScoreboard(this.bot);
    });
  }

  calcTick() {
    // console.timeEnd("mineflayer");
    // console.time("other"); //max registered time: 0.1ms

    //1. check if bestAction changed
    const bestAction = new BestAction(this).getValue(this);

    if (bestAction !== this.currentAction) {
      this.currentAction?.stop(this.bot);
      this.currentAction = bestAction;
      if (this.currentAction) this.currentAction.run(this);
      this.bot.chat(`Running action: ${this.currentAction?.id}`);
    }
      
    //5. check for relevant status changes
    if (this.changes.size === 0) { //low priority
      console.log("reque changes");
      Object.keys(this.cache).filter(factorId => factorId.startsWith("ClosestItemDrop")).forEach(factorId => this.changes.add(factorId));//check for drops
      Object.keys(this.cache).filter(factorId => factorId.startsWith("ClosestBlock")).forEach(factorId => this.changes.add(factorId));//check for blocks
    }
    // console.timeEnd("other");

    //6. do some cache network calculations

    // console.time("calcChanges"); //often around 80ms
    this.calcChanges(40);
    // console.timeEnd("calcChanges");

    // console.time("mineflayer"); //max registered time: 4ms
  }

  calcChanges(forMS: number){
    const startTime = Date.now();
    var changeCount = 0;
    
    while (this.changes.size > 0 && Date.now() - startTime < forMS) {
      const factorId = this.changes.values().next().value ?? ""; // "" should not be possible to reach
      this.changes.delete(factorId); //remove recalced factor

      const factor = this.cache[factorId].factor;
      if (!factor) continue;

      factor.recalc(this);

      //TODO only change dependents if the value is diffrent
      if (this.dependents[factorId]){
        this.dependents[factorId].forEach(dependent => this.changes.add(dependent)); // add dependents to changes
      }

      changeCount++;
    }

    // console.log(`changes: ${changeCount}`);
  }

  changeFactor(factor: string, value: any) {
    this.cache[factor].value = value;
    if (this.dependents[factor]) {
      this.dependents[factor].forEach(dependent => this.changes.add(dependent)); //also update dependents
    }
  }
}