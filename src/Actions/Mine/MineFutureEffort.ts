import Bot from "../../Bot";
import Factor from "../../Factors/Factor";

export default class MineFutureEffort extends Factor<number> {
    block: string
    goal: string
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string, goal: string) { //maybe change to Actual Block instance instead of string
        super("MineFutureEffort" + block);
        this.block = block;
        this.goal = goal;
    }

    protected calc(bot: Bot): number {
        //TODO add Tools, Rarity and hardness
        return 200
    }
}