import Bot from "../../Bot";
import MCFactor from "../MCFactor";

export default class ItemCount extends MCFactor<number> {
    item: string
    count: number

    constructor(item: string, count: number = 1) {
        super("ItemCount:" + item + count);
        this.item = item;
        this.count = count
    }

    protected calc(bot: Bot, get: (factor: MCFactor<any>) => any): number {
        const count = bot.bot.inventory.count(bot.bot.registry.itemsByName[this.item].id, null);
        return count
    }
}