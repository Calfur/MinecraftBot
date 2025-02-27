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
    goal: string
    //TODO maybe allow mining multiple blocks in one Action or let it use multiple actions
    constructor(block: string, goal: string) { //maybe change to Actual Block instance instead of string
        super("Mine" + block, new MineCanRun(block), new MineCurrentEffort(block), new MineFutureEffort(block), new MineDependencies(block));
        this.block = block;
        this.goal = goal;
    }

    run(bot: Bot): void {
        const mineBlock = bot.bot.findBlock({ matching: bot.bot.registry.blocksByName[this.block].id, maxDistance: SEARCHDISTANCE });
        if (!mineBlock) {
            // explore world
            this.stopped = true
            return
        }

        bot.bot.pathfinder.goto(new goals.GoalNear(mineBlock.position.x, mineBlock.position.y, mineBlock.position.z, REACHDISTANCE)).then(() => {
            if (!bot.bot.canDigBlock(mineBlock)) {
                bot.bot.chat("Not able to dig block " + mineBlock.name + " at " + mineBlock.position.toString())
                this.stopped = true
            }
            //TODO: select proper tool
            bot.bot.dig(mineBlock, false)
                .then(() => this.stopped = true)
                .catch(() => { // important to catch promise-errors
                    this.stopped = true
                    bot.bot.chat("Digging failed for block " + mineBlock.name + " at " + mineBlock.position.toString())
                });
        }).catch(() => {
            this.stopped = true
        })
    }
    abortAction(bot: mineflayer.Bot): void {
        bot.stopDigging(); //throws error
    }
}