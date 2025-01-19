import { createBot } from "mineflayer";
import Action from "./Actions/Action";
import Target from "./Targets/Target";
import GetItem from "./Targets/GetItem";

const initialTargets: Target[] = [
  new GetItem('orange_dye'),
  new GetItem('torch'),
];
const bot = createBot({
  username: 'Hugo',
})

var isInitialized = false;
var remainingTargets: Target[];
var actionInProgress: Action | null;

bot.on('spawn', () => {
  if (!isInitialized) {
    initializeBot();
  }
});

bot.on('physicTick', () => {
  remainingTargets = remainingTargets.filter(t => !t.isCompleted());

  if (!actionInProgress?.isInProgress()) {
    actionInProgress = null;
  }

  const startableActions = getStartableActionsForTargets(remainingTargets);

  if (startableActions.length > 0) {
    const priorizedAction = startableActions[0];

    if (actionInProgress === null || actionInProgress.getKey() !== priorizedAction.getKey()) {
      actionInProgress?.cancelAction(bot);
      priorizedAction.startAction(bot);
      actionInProgress = priorizedAction;
    }
  }
})

function initializeBot() {
  remainingTargets = initialTargets;

  remainingTargets.forEach(t => {
    t.attatchCompletedListener(bot);
  });

  isInitialized = true;
}

function getStartableActionsForTargets(targets: Target[]): Action[] {
  return targets
    .flatMap(t => t.getActions(bot))
    .flatMap(a => getStartableActions(a));
}

function getStartableActions(action: Action): Action[] {
  const missingDependencies = action.getMissingDependencies(bot);

  if (missingDependencies.length === 0) {
    return [action];
  }

  return getStartableActionsForTargets(missingDependencies);
}
