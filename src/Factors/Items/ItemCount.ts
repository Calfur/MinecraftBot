import Bot from "../../Bot";
import Factor from "../Factor";

export default class ItemCount extends Factor<number> {
    item: string

    constructor(item: string) {
        super("ItemCount:" + item);
        this.item = item;
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): number {
        const count = bot.bot.inventory.count(bot.bot.registry.itemsByName[this.item].id, null);
        return count
    }
}