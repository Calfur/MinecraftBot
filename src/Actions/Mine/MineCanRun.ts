import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import ClosestBlock from "./ClosestBlock";

export default class MineCanRun extends MCFactor<boolean> {
    block: string
    constructor(block: string) {
        super("MineCanRun"+block);
        this.block = block
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): boolean {
        //TODO consider tools
        const mineBlock = get(new ClosestBlock(this.block));

        return mineBlock !== null
    }
}
