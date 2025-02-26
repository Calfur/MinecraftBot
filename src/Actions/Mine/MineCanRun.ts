import Bot from "../../Bot";
import { SEARCHDISTANCE } from "../../Constants";
import Factor from "../../Factors/Factor";

export default class MineCanRun extends Factor<boolean> {
    block: string
    constructor(block: string) {
        super("MineCanRun"+block);
        this.block = block
    }

    protected calc(bot: Bot): boolean {
        //TODO consider tools
        const mineBlock = bot.bot.findBlock({ matching: bot.bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE });

        return mineBlock !== null
    }
}
