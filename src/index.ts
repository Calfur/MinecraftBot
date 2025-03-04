import Action from "./Actions/Action";
import ActionsToOwnItem from "./Factors/Items/ActionsToOwnItem";
import Factor from "./Factors/Factor";
import BenchMark from "./Benchmark/Benchmark";


const targets: Factor<Action[]>[] = [
  // new ActionsToOwnItem('stick', 5),
  new ActionsToOwnItem('oak_planks', 1),
];
    
new BenchMark("test",targets).run();
