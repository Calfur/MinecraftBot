import Bot from "../../Bot";
import Factor from "../../Factors/Factor";
import Action from "../Action";

export default class CollectDependencies extends Factor<Action[]> {
    item: string
    constructor(item: string) {
        super("CollectDependencies" + item);
        this.item = item
    }

    protected calc(bot: Bot): Action[] {
        return []
    }
}
