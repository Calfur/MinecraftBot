import Bot from "../../Bot";
import Factor from "../Factor";

export default class MineCanRun extends Factor<boolean> {
    block: string
    constructor(block: string) {
        super("MineCanRun"+block);
        this.block = block
    }

    calc(bot: Bot): boolean {
        //TODO consider tools
        return true
    }
}
