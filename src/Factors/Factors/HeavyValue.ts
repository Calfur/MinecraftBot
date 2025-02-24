import Factor from "../Factor";
import TestBot from "../TestBot";

export default class HeavyValue extends Factor<number> {
    constructor(name: string) {
        super("HeavyValue" + name);
    }

    calc(bot: TestBot): number {
        const start = Date.now();
        while (Date.now() - start < 10) { // allows 5 per tick
            // Do nothing, just waste time
        }
        // no dependencies
        return 1;
    }
}