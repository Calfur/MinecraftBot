import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import Action from "../Action";

export default class MineDependencies extends MCFactor<Action[]> {
    block: string

    constructor(block: string) {
        super("MineDependencies" + block);
        this.block = block
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): Action[] {
        //TODO add Actions for tools
        return []
    }
}