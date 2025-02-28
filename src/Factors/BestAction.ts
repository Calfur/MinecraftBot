import Action from "../Actions/Action";
import Bot from "../Bot";
import Factor from "./Factor";

export default class BestAction extends Factor<Action|null> {
    constructor() {
        super("bestAction");
    }

    protected calc(bot: Bot, get: (factor: Factor<any>) => any): Action|null {
        //2. get startable actions (cached)
        var actions = []
        for (const action of bot.neededActions) {
            actions.push(...get(action))

            //TODO reduce redundant Actions
        }
        
        //3. start lowest effort action (not cached)
        const possibleActions = actions.filter(action => get(action.canRun));
        possibleActions.sort((a, b) => get(a.currentEffort) / get(a.FutureEffort) - get(b.currentEffort) / get(b.FutureEffort));

        return possibleActions[0] ?? null;
    }
}