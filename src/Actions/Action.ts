import { Bot } from "mineflayer";
import Target from "../Targets/Target";

export default interface Action {
  getKey(): string;
  getMissingDependencies(bot: Bot): Target[];
  startAction(bot: Bot): void;
  cancelAction(bot: Bot): void;
  isInProgress(): boolean;
  getEffort(): number;
}
