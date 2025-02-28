import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import ClosestItemDrop from "./ClosestItemDrop";

export default class CollectCurrentEffort extends MCFactor<number> {
    item: string
    constructor(item: string) {
        super("CollectCurrentEffort");
        this.item = item
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): number {
        const closestItem = get(new ClosestItemDrop(this.item));
        if (!closestItem) return Infinity
        return closestItem.position.distanceTo(bot.bot.entity.position)
    }
}