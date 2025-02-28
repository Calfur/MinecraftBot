import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import ClosestItemDrop from "./ClosestItemDrop";

export default class CollectCanRun extends Factor<boolean> {
    item: string
    constructor(item: string) {
        super("CollectCanRun"+item);
        this.item = item
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): boolean {
        return get(new ClosestItemDrop(this.item)) !== null
    }
}
