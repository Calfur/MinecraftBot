import Action from "../Actions/Action";
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
        const possibleActions = actions.filter(action => this.get(action.canRun));
        possibleActions.sort((a, b) => this.get(a.currentEffort) / this.get(a.FutureEffort) - this.get(b.currentEffort) / this.get(b.FutureEffort));

        return possibleActions[0] ?? null;
    }
}