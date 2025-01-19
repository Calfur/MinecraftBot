import { Bot, createBot } from "mineflayer";
import Target from "./Targets/Target";
import Action from "./Actions/Action";

export default class Hugo {
  private bot: Bot;
  private isInitialized = false;
  private remainingTargets?: Target[];
  private actionInProgress?: Action | null;

  constructor(targets: Target[]) {
    this.bot = createBot({
      username: 'Hugo',
    })

    this.bot.on('spawn', () => {
      if (!this.isInitialized) {
        this.initializeBot(targets);
      }
    });

    this.bot.on('physicTick', () => {
      if (!this.isInitialized || !this.remainingTargets) {
        return;
      }

      this.remainingTargets = this.remainingTargets.filter(t => !t.isCompleted());

      if (!this.actionInProgress?.isInProgress()) {
        this.actionInProgress = null;
      }

      const startableActions = getStartableActionsForTargets(this.bot, this.remainingTargets);

      if (startableActions.length > 0) {
        const priorizedAction = startableActions[0];

        if (this.actionInProgress === null || this.actionInProgress.getKey() !== priorizedAction.getKey()) {
          this.actionInProgress?.cancelAction(this.bot);
          priorizedAction.startAction(this.bot);
          this.actionInProgress = priorizedAction;
        }
      }
    })
  }

  private initializeBot(targets: Target[]) {
    this.remainingTargets = targets;

    this.remainingTargets.forEach(t => {
      t.attatchCompletedListener(this.bot);
    });

    this.isInitialized = true;
  }
}

function getStartableActionsForTargets(bot: Bot, targets: Target[]): Action[] {
  return targets
    .flatMap(t => t.getActions(bot))
    .flatMap(a => getStartableActions(bot, a));
}

function getStartableActions(bot: Bot, action: Action): Action[] {
  const missingDependencies = action.getMissingDependencies(bot);

  if (missingDependencies.length === 0) {
    return [action];
  }

  return getStartableActionsForTargets(bot, missingDependencies);
}
