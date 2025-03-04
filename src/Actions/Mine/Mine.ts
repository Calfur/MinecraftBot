import Action from "../Action"
import mineflayer from "mineflayer"
import Bot from "../../Bot"
import { REACHDISTANCE, SEARCHDISTANCE } from "../../Constants"
import { goals } from "mineflayer-pathfinder"
import MineCanRun from "./MineCanRun"
import MineCurrentEffort from "./MineCurrentEffort"
import MineFutureEffort from "./MineFutureEffort"
import MineDependencies from "./MineDependencies"

export class Mine extends Action {
    block: string
    
    constructor(block: string) {
        super("Mine" + block, new MineCanRun(block), new MineCurrentEffort(block), new MineFutureEffort(block), new MineDependencies(block));
        this.block = block;
    }

    run(bot: Bot): void {
        const mineBlock = bot.bot.findBlock({ matching: bot.bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE });
        if (!mineBlock) {
            // explore world
            this.fail(bot, "no block found")
            return
        }
        
        bot.bot.collectBlock.collect([mineBlock], { ignoreNoPath: true }).then(() => {
            this.success(bot)
        }).catch(async (reason: any) => {
            this.fail(bot, "collecting block failed " + reason)
        })
    }

    abortAction(bot: mineflayer.Bot) {
        bot.collectBlock.cancelTask()
    }
    
    registerChanges(bot: Bot): void {
        bot.cache.addChange(/^ClosestBlock${block}/);
    }
}