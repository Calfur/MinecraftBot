import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import ClosestBlock from "./ClosestBlock";

export default class MineCurrentEffort extends MCFactor<number> {
    block: string
    constructor(block: string) {
        super("MineCurrentEffort");
        this.block = block
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): number {
        const mineBlock = get(new ClosestBlock(this.block));

        if (!mineBlock) return Infinity

        const distance = mineBlock.position.distanceTo(bot.bot.entity.position)
        // TODO: depends on tool in hand
        
        return (distance * 20 / bot.bot.physics.sprintSpeed) + bot.bot.digTime(mineBlock)
    }
}