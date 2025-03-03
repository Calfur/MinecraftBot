import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import ClosestBlock from "./ClosestBlock";

export default class MineCanRun extends Factor<boolean> {
    block: string
    constructor(block: string) {
        super("MineCanRun"+block);
        this.block = block
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): boolean {
        //TODO consider tools
        const mineBlock = get(new ClosestBlock(this.block));

        return mineBlock !== null
    }
}
