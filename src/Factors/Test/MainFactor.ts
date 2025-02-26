import Factor from "./TestFactor";
import TestBot from "./TestBot";
import HeavyValue from "./HeavyValue";

export default class MainFactor extends Factor<string> {
    constructor() {
        super("MainFactor")
    }

    calc(bot: TestBot): string {
        var total: number = 0
        for (let i = 0; i < 10; i++) {
            this.get(new HeavyValue(i)); //simulate requiring 10 heavy values
            total += i
        }
        console.log("calced MainFactor", total);
        return total.toString();
    }
}