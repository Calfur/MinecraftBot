import Factor from "../Factor";
import TestBot from "./TestBot";

export default class HeavyValue extends Factor<number> {
    num: number
    constructor(num: number) {
        super("HeavyValue" + num);
        this.num = num
    }

    calc(bot: TestBot): number {
        const start = Date.now();
        while (Date.now() - start < 10) { // allows 5 per tick
            // Do nothing, just waste time
        }
        // no dependencies
        console.log("calced HeavyValue", this.num);
        return this.num;
    }
}