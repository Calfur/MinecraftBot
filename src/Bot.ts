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

  constructor(name: string) {
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

  calcChanges(forMS: number){
    const startTime = Date.now();
    
    while (this.changes.size > 0 && Date.now() - startTime < forMS) {
      const factorId = this.changes.values().next().value ?? ""; // "" should not be possible to reach
      this.changes.delete(factorId); //remove recalced factor

      const factor = this.cache[factorId].factor;
      if (!factor) continue;

      factor.recalc(this);

      //TODO only change dependents if the value changed
      if (this.dependents[factorId]){
        this.dependents[factorId].forEach(dependent => this.changes.add(dependent)); // add dependents to changes
      }
    }
  }

  changeFactor(factor: string, value: any) {
    this.cache[factor].value = value;
    if (this.dependents[factor]) {
      this.dependents[factor].forEach(dependent => this.changes.add(dependent)); //also update dependents
    }
  }
}