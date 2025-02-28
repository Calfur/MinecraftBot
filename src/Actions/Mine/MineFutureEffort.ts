import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";

export default class MineFutureEffort extends MCFactor<number> {
    block: string
    
    constructor(block: string) {
        super("MineFutureEffort" + block);
        this.block = block;
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): number {
        //TODO add Tools, Rarity and hardness
        return 200 //10 sec
    }
}