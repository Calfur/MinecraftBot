import Bot from "../../Bot";
import MCFactor from "../../Factors/MCFactor";
import Action from "../Action";

export default class CollectDependencies extends MCFactor<Action[]> {
    item: string
    constructor(item: string) {
        super("CollectDependencies" + item);
        this.item = item
    }

    protected calc(bot: Bot): Action[] {
        return []
    }
}
