import { Bot } from "mineflayer";
import Action from "../Actions/Action";

export default interface Target {
  isCompleted(bot: Bot): boolean;
  getActions(bot: Bot): Action[];
}
