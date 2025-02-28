import Bot from "../Bot";
import Factor from "./Factor";

export default abstract class MCFactor<T> extends Factor<T> {
    // TODO add some mcdata or usefull tools here
    protected abstract calc(bot: Bot, get: (factor: MCFactor<any>) => any): T
}