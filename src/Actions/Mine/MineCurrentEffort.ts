import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import ClosestBlock from "./ClosestBlock";

export default class MineCurrentEffort extends Factor<number> {
    block: string
    constructor(block: string) {
        super("MineCurrentEffort");
        this.block = block
    }

    protected calc(bot: Bot): number {
        const mineBlock = this.get(new ClosestBlock(this.block));

        if (!mineBlock) return Infinity

        const distance = mineBlock.position.distanceTo(bot.bot.entity.position)
        // TODO: depends on tool in hand
        
        return (distance * 20 / bot.bot.physics.sprintSpeed) + bot.bot.digTime(mineBlock)
    }
}