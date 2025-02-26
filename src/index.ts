import Action from "./Action";
import Bot from "./Bot";
import ActionsToOwnItem from "./Factors/ActionPlan/ActionsToOwnItem";
import Factor from "./Factors/Factor";


const steve = new Bot("Steve");

steve.bot.once('spawn', () => {
    const initialTargets: Factor<{action: Action, canRun: boolean, effortFuture: number, effortNow: number}[]>[] = [
      // new ActionsToOwnItem('stick', 5),
      new ActionsToOwnItem('orange_dye', 1),
    ];
    
    steve.neededActions.push(...initialTargets);
    
    steve.changes.add("TargetCompleteOwnTool:fordirt");
});
