import { createBot } from "mineflayer";
import Action from "./Actions/Action";
import Craft from "./Actions/Craft";

const targetActions: Action[] = [
  new Craft('torch'),
]

var actionInProgress: Action | null;

const hugo = createBot({
  username: 'Hugo',
})

hugo.on('physicTick', () => {
  if (!actionInProgress?.isInProgress()) {
    actionInProgress = null;
  }

  const startableActions = targetActions.flatMap(a => getStartableActions(a));

  if (actionInProgress === null && startableActions.length > 0) {
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
