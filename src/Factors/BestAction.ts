import Action from "../Action";
import Bot from "../Bot";
import Factor from "./Factor";

export default class BestAction extends Factor<Action|null> {
    constructor(bot: Bot) {
        super("bestAction");
    }

    protected calc(bot: Bot): Action|null {
        //2. get startable actions (cached)
        var actions = []
        for (const action of bot.neededActions) {
            actions.push(...this.get(action))

            //TODO reduce redundant Actions
        }
        
        //3. start lowest effort action (not cached)
        const possibleActions = actions.filter(action => action.canRun);
        possibleActions.sort((a, b) => a.effortNow / a.effortFuture - b.effortNow / b.effortFuture);

        return possibleActions[0].action ?? null;
    }
}