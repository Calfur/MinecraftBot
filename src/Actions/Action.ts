import { Bot } from "mineflayer";

export default interface Action {
  getMissingDependencies(bot: Bot): Action[];
  startAction(bot: Bot): void;
  cancelAction(bot: Bot): void;
}