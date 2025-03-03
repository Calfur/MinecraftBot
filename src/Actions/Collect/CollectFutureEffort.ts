import Bot from "../../Bot";
import Factor from "../../Factors/Factor";

export default class CollectFutureEffort extends Factor<number> {
    item: string

    constructor(item: string) {
        super("CollectFutureEffort" + item)
        this.item = item
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): number {
        return 10000;
    }
}