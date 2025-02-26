import Action from "../Action";
import Bot from "../Bot";
import Factor from "./Factor";

export default class BestAction extends Factor<Action|null> {
    constructor(bot: Bot) {
        super("bestAction");
    }

    calc(bot: Bot): Action|null {
        //2. get startable actions (cached)
        var actions = []
        for (const action of bot.neededActions) {
            actions.push(...this.get(action))


            //maybe reduce redundant Actions
        }
        
        //3. start lowest effort action (not cached)

        return null;
    }
}