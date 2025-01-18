import { createBot } from "mineflayer";
import Action from "./Actions/Action";
import Craft from "./Actions/Craft";

const targetActions: Action[] = [
  new Craft('orange_dye'),
]

const hugo = createBot({
  username: 'Hugo',
})

targetActions.forEach(action => {
  hugo.on('physicTick', () => {
    const missingDependencies = action.getMissingDependencies(hugo);

    if (missingDependencies.length === 0) {
      action.startAction(hugo);
    }
  })
})
