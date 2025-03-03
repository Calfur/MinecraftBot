import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import Action from "../Action";

export default class MineDependencies extends Factor<Action[]> {
    block: string

    constructor(block: string) {
        super("MineDependencies" + block);
        this.block = block
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): Action[] {
        //TODO add Actions for tools
        return []
    }
}