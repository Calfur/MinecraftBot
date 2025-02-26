import Bot from "../../Bot";
import Factor from "../Factor";

export default class FutureEffortCollect extends Factor<number> {
    item: string

    constructor(item: string) {
            super("FutureEffortCollect" + item)
            this.item = item
        }

        protected calc(bot: Bot): number {
        return 10000;
    }
}