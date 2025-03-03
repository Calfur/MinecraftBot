import Bot from "../../Bot";
import Factor from "../../Factors/Factor";

export default class MineFutureEffort extends Factor<number> {
    block: string
    
    constructor(block: string) {
        super("MineFutureEffort" + block);
        this.block = block;
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): number {
        //TODO add Tools, Rarity and hardness
        return 200 //10 sec
    }
}