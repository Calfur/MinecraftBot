import Action from "./Actions/Action";
import Bot from "./Bot";
import ActionsToOwnItem from "./Factors/Items/ActionsToOwnItem";
import Factor from "./Factors/Factor";


const steve = new Bot("Steve");

steve.bot.once('spawn', () => {
    const initialTargets: Factor<Action[]>[] = [
      // new ActionsToOwnItem('stick', 5),
      new ActionsToOwnItem('apple', 1),
    ];
    
    steve.neededActions.push(...initialTargets);
});
