import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import ClosestItemDrop from "./ClosestItemDrop";

export default class CollectCanRun extends MCFactor<boolean> {
    item: string
    constructor(item: string) {
        super("CollectCanRun"+item);
        this.item = item
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): boolean {
        return get(new ClosestItemDrop(this.item)) !== null
    }
}
