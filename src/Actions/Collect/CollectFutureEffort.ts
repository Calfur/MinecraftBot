import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";

export default class CollectFutureEffort extends MCFactor<number> {
    item: string

    constructor(item: string) {
        super("CollectFutureEffort" + item)
        this.item = item
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): number {
        return 10000;
    }
}