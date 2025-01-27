import { Bot } from "mineflayer";
import { goals, Movements } from "mineflayer-pathfinder";
import Target from "../Targets/Target";
import Action from "./Action";
import { Vec3 } from "vec3";
import { vec3ToString } from "../vec3Helper";

const COMPLETED_DISTANCE = 2;

export default class WalkTo implements Action {
  private position: Vec3;
  private inProgress = false;

  constructor(position: Vec3) {
    this.position = position;
  }

  getKey(): string {
    return `WalkTo:${vec3ToString(this.position)}`;
  }

  getMissingDependencies(bot: Bot): Target[] {
    return [];
  }

  startAction(bot: Bot): void {
    this.inProgress = true;
    bot.chat(`Walking to ${vec3ToString(this.position)}`);

    const goal = new goals.GoalNear(this.position.x, this.position.y, this.position.z, COMPLETED_DISTANCE);

    bot.pathfinder.setMovements(new Movements(bot));
    bot.pathfinder.setGoal(goal);
  }

  cancelAction(bot: Bot): void {
    this.inProgress = false;
    bot.pathfinder.stop()
    bot.chat(`Canceled walking to ${vec3ToString(this.position)}`);
  }

  isInProgress(): boolean {
    return this.inProgress;
  }

  getEffort(bot: Bot): number {
    const distance = bot.entity.position.distanceTo(this.position);

    return distance;
  }
}
