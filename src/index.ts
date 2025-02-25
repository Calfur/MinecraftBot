import Target from "./Target";
import OwnItem from "./Targets/OwnItem";
import Bot from "./Bot";
import OwnTool from "./Targets/OwnTool";


const steve = new Bot("Steve");

steve.bot.once('spawn', () => {
    const initialTargets: Target[] = [
      new OwnItem('stick', 5),
      new OwnItem('orange_dye', 1),
      new OwnTool(steve.bot.registry.blocksByName['dirt']),
    ];
    
    steve.goals.push(...initialTargets);
    
    steve.changes.add("TargetCompleteOwnTool:fordirt");
});
