import Bot from "../../Bot";
import Target from "../../Target";
import Factor from "../Factor";

export default class TargetComplete extends Factor<boolean> {
    target: Target;
    constructor(target: Target) {
        super("TargetComplete" + target.id);
        this.target = target;
    }
    
    public calc(bot: Bot): boolean {
        return this.target.isCompleted(bot.bot);
    }
}