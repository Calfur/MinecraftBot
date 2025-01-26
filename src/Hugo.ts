import { Bot, createBot } from "mineflayer";
import { pathfinder } from "mineflayer-pathfinder";
import Target from "./Targets/Target";
import Action from "./Actions/Action";
import TpsScoreboard from "./TpsScoreboard";

export default class Hugo {
  private bot: Bot;
  private isInitialized = false;
  private remainingTargets?: Target[];
  private actionInProgress?: Action | null;
  private isCompletedMessageSent = false;
  private tpsScoreboard?: TpsScoreboard;
  private tickCounter = 0;

  constructor(targets: Target[]) {
    this.bot = createBot({
      username: 'Hugo',
    })

    this.bot.loadPlugin(pathfinder)

    this.bot.on('spawn', () => {
      if (!this.isInitialized) {
        this.bot.chat(`/clear ${this.bot.username}`);

        this.initializeBot(targets);
        this.tpsScoreboard = new TpsScoreboard(this.bot);
      }
    });

    this.bot.on('physicTick', () => {
      this.tpsScoreboard?.tick();

      if (!this.isInitialized || !this.remainingTargets) {
        return;
      }

      this.tickCounter++;
      if (this.tickCounter % 20 !== 0) {
        return;
      }

      this.remainingTargets = this.remainingTargets.filter(t => !t.isCompleted(this.bot));

      if (this.remainingTargets.length === 0) {
        if (!this.isCompletedMessageSent) {
          this.bot.chat("☑ All targets completed! ☑");
          this.isCompletedMessageSent = true;
        }

        return;
      }

      this.isCompletedMessageSent = false;

      if (!this.actionInProgress?.isInProgress()) {
        this.actionInProgress = null;
      }

      const startableActions = getStartableActionsForTargets(this.bot, this.remainingTargets);

      if (startableActions.length > 0) {
        const priorizedAction = startableActions.sort((a, b) => a.getEffort(this.bot) - b.getEffort(this.bot))[0];

        if (this.actionInProgress === null || this.actionInProgress.getKey() !== priorizedAction.getKey()) {
          this.actionInProgress?.cancelAction(this.bot);
          priorizedAction.startAction(this.bot);
          this.actionInProgress = priorizedAction;
        }
      }
    });
  }

  private initializeBot(targets: Target[]) {
    this.remainingTargets = targets;
    this.isInitialized = true;
  }
}

function getStartableActionsForTargets(bot: Bot, targets: Target[], blockedActions?: string[]): Action[] {
  return targets
    .flatMap(target => target.getActions(bot))
    .filter(action => !blockedActions?.includes(action.getKey()))
    .flatMap(action => getStartableActions(bot, action, blockedActions));
}

function getStartableActions(bot: Bot, action: Action, blockedActions: string[] = []): Action[] {
  const missingDependencies = action.getMissingDependencies(bot);

  if (missingDependencies.length === 0) {
    return [action];
  }

  return getStartableActionsForTargets(bot, missingDependencies, [...blockedActions, action.getKey()]);
}
