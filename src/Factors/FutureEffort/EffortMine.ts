import Bot from "../../Bot";
import Factor from "../Factor";

export default class EffortMineFuture extends Factor<number> {
    block: string
    goal: string
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string, goal: string) { //maybe change to Actual Block instance instead of string
        super("EffortMineFuture" + block);
        this.block = block;
        this.goal = goal;
    }

    calc(bot: Bot): number {
        //TODO add Tools, Rarity and hardness
        return 200
    }
}