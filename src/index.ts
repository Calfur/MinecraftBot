import Action from "./Actions/Action";
import Bot from "./Bot";
import ActionsToOwnItem from "./Factors/Items/ActionsToOwnItem";
import MCFactor from "./Factors/MCFactor";


const steve = new Bot("Steve");

steve.bot.once('spawn', () => {
    const initialTargets: MCFactor<Action[]>[] = [
      // new ActionsToOwnItem('stick', 5),
      new ActionsToOwnItem('oak_planks', 1),
    ];
    
    steve.neededActions.push(...initialTargets);
});
