import { Bot } from "mineflayer";
import Action from "../Actions/Action";

export default interface Target {
  attatchCompletedListener(bot: Bot): void;
  isCompleted(): boolean;
  getActions(bot: Bot): Action[];
}
