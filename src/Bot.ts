import mineflayer, { createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Action from "./Actions/Action";
import TpsScoreboard from "./TpsScoreboard";
import BestAction from "./Factors/BestAction";
import Factor from "./Factors/Factor";

export default class Bot {
  bot: mineflayer.Bot;
  neededActions: Factor<Action[]>[] = []; //Factors providing actions which should be done
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

    if (this.currentAction?.stopped) this.currentAction = null;

    //1. check if bestAction changed
    const bestAction = new BestAction().getValue(this);

    if (bestAction?.id !== this.currentAction?.id) {
      this.currentAction?.stop(this.bot);
      this.currentAction = bestAction;
      if (this.currentAction) this.currentAction.run(this);
      this.bot.chat(`Running action: ${this.currentAction?.id}`);
    }
      
    //5. check for relevant status changes
    if (this.changes.size === 0) { //low priority
      this.addChange("ClosestItemDrop")//check for drops
      this.addChange("ClosestBlock")//check for blocks
      this.addChange("ItemCount")//check for items in inventory
    }
    // console.timeEnd("other");

    //6. do some cache network calculations

    // console.time("calcChanges"); //often around 80ms for 32 range
    this.calcChanges(10);
    // console.timeEnd("calcChanges");

    // console.time("mineflayer"); //max registered time: 4ms
  }

  calcChanges(forMS: number){
    const startTime = Date.now();
    
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
    }
  }

  addChange(startWith: string) {
    Object.keys(this.cache).filter(factorId => factorId.startsWith(startWith)).forEach(factorId => this.changes.add(factorId));
  }
}