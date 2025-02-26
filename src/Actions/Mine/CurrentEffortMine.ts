import Bot from "../../Bot";
import { SEARCHDISTANCE } from "../../Constants";
import Factor from "../../Factors/Factor";

export default class CurrentEffortMine extends Factor<number> {
    block: string
    constructor(block: string) {
        super("CurrentEffortMine");
        this.block = block
    }

    protected calc(bot: Bot): number {
        // maybe change to only calc varying effort
        const mineBlock = bot.bot.findBlock({ matching: bot.bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE });
        if (!mineBlock) return Infinity
        const distance = mineBlock.position.distanceTo(bot.bot.entity.position)
        // TODO: depends on tool in hand
        return (distance * 20 / bot.bot.physics.sprintSpeed) + bot.bot.digTime(mineBlock)
    }
}