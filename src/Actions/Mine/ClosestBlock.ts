import Bot from "../../Bot";
import { SEARCHDISTANCE } from "../../Constants";
import MCFactor from "../../Factors/MCFactor";
import {Block} from "prismarine-block"

export default class ClosestBlock extends MCFactor<Block|null> {
    block: string
    
    constructor(block: string) {
        super("ClosestBlock"+block);
        this.block = block
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): Block|null {
        const block = bot.bot.findBlock({matching: bot.bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE});
        return block;
    }
}