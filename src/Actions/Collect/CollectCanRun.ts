import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import ClosestItemDrop from "./ClosestItemDrop";

export default class CollectCanRun extends Factor<boolean> {
    item: string
    constructor(item: string) {
        super("CollectCanRun"+item);
        this.item = item
    }

    protected calc(bot: Bot): boolean {
        return this.get(new ClosestItemDrop(this.item)) !== undefined
    }
}
