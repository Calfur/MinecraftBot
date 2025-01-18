import { createBot } from "mineflayer";
import Action from "./Actions/Action";
import Craft from "./Actions/Craft";

const targetActions: Action[] = [
  new Craft('orange_dye'),
]

var actionInProgress: Action | null;

const hugo = createBot({
  username: 'Hugo',
})

hugo.on('physicTick', () => {
  const startableActions = targetActions.flatMap(a => getStartableActions(a));

  if (!actionInProgress?.isInProgress() && startableActions.length > 0) {
    startableActions[0].startAction(hugo);
    actionInProgress = startableActions[0];
  }
})

function getStartableActions(action: Action): Action[] {
  const missingDependencies = action.getMissingDependencies(hugo);

  if (missingDependencies.length === 0) {
    return [action];
  }

  return missingDependencies.flatMap(getStartableActions);
}
