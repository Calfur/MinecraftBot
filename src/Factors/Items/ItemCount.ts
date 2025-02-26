import Bot from "../../Bot";
import Factor from "../Factor";

export default class ItemCount extends Factor<number> {
    item: string
    count: number

    constructor(item: string, count: number = 1) {
        super("ItemCount:" + item + count);
        this.item = item;
        this.count = count
    }

    protected calc(bot: Bot): number {
        return bot.bot.inventory.count(this.item, null)
    }
}