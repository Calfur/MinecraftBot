import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import ClosestItemDrop from "./ClosestItemDrop";

export default class CollectCurrentEffort extends Factor<number> {
    item: string
    constructor(item: string) {
        super("CollectCurrentEffort");
        this.item = item
    }

    protected calc(bot: Bot): number {
        const closestItem = this.get(new ClosestItemDrop(this.item));
        if (!closestItem) return Infinity
        return closestItem.position.distanceTo(bot.bot.entity.position)
    }
}