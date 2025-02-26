import Bot from "../../Bot";
import { SEARCHDISTANCE } from "../../Constants";
import Factor from "../../Factors/Factor";
import {Block} from "prismarine-block"

export default class ClosestBlock extends Factor<Block|null> {
    block: string
    
    constructor(block: string) {
        super("ClosestBlock"+block);
        this.block = block
    }

    protected calc(bot: Bot): Block|null {
        const block = bot.bot.findBlock({matching: bot.bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE});
        return block;
    }
}