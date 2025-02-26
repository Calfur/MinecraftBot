import Bot from "../../Bot";
import Factor from "../../Factors/Factor";

export default class CollectFutureEffort extends Factor<number> {
    item: string

    constructor(item: string) {
        super("CollectFutureEffort" + item)
        this.item = item
    }

    protected calc(bot: Bot): number {
        return 10000;
    }
}