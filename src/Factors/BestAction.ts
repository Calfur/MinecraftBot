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
        for (const goal of bot.goals) {
            // i think instead of having Actions and Targets, we have Factors and then later run Actions (Action only to run)

            // for goals get actions working towards it (action, importance (1-0))
            //
            // for actions get requirements
            // for requirements get actions working towards it

            // could keep path i think

            //maybe reduce redundant Actions
        }
        
        //3. start lowest effort action (not cached)

        return null;
    }
}