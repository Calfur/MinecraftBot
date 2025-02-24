import Factor from "../Factor";
import TestBot from "../TestBot";
import HeavyValue from "./HeavyValue";

export default class MainFactor extends Factor<number> {
    constructor() {
        super("MainFactor")
    }

    calc(bot: TestBot): number {
        for (let i = 0; i < 10; i++) {
            this.get(new HeavyValue(i.toString())); //simulate requiring 10 heavy values
        }
        return 1
    }
}