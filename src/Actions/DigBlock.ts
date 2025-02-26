import Action from "../Action"
import mineflayer from "mineflayer"
import Bot from "../Bot"
import { REACHDISTANCE, SEARCHDISTANCE } from "../Constants"
import { goals } from "mineflayer-pathfinder"

export class DigBlock extends Action {
    block: string
    goal: string
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string, goal: string) { //maybe change to Actual Block instance instead of string
        super("MineBlock" + block);
        this.block = block;
        this.goal = goal;
    }

    run(bot: Bot): void {
        const mineBlock = bot.bot.findBlock({ matching: bot.bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE });
        if (!mineBlock) {
            // explore world
            return
        }

        bot.bot.pathfinder.goto(new goals.GoalNear(mineBlock.position.x, mineBlock.position.y, mineBlock.position.z, REACHDISTANCE)).then(() => {
            if (!bot.bot.canDigBlock(mineBlock)) {
                bot.bot.chat("Not able to dig block " + mineBlock.name + " at " + mineBlock.position.toString())
                this.stopped = true
            }
            //TODO: select proper tool
            const digPromise = bot.bot.dig(mineBlock, false);
            
            digPromise.then(() => this.stopped = true);
            
            digPromise.catch(() => { // important to catch promise-errors
                this.stopped = true
                bot.bot.chat("Digging failed for block " + mineBlock.name + " at " + mineBlock.position.toString())
            });
        }).catch(() => {
            this.stopped = true
        })
    }

    // getEffortNow(bot: mineflayer.Bot): number {
    //     // maybe change to only calc varying effort
    //     const mineBlock = bot.findBlock({ matching: bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE });
    //     if (!mineBlock) return Infinity
    //     const distance = mineBlock.position.distanceTo(bot.entity.position)
    //     // TODO: depends on tool in hand
    //     return (distance * 20 / bot.physics.sprintSpeed) + bot.digTime(mineBlock)
    // }

    abortAction(bot: mineflayer.Bot): void {
        bot.stopDigging();
    }

    // getEffortFuture(bot: Bot): number {
    //     //depends on rarity and hardness of block
    //     return 200
    // }

    // getRequirements(bot: mineflayer.Bot): Target[] {
    //     return [new OwnTool(bot.registry.blocksByName[this.block])]
    // }
}