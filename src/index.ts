import Target from "./Targets/Target";
import OwnItem from "./Targets/OwnItem";
import Hugo from "./Hugo";

const initialTargets: Target[] = [
//   new OwnItem('cobblestone', 1),
  new OwnItem('stick', 5),
  new OwnItem('orange_dye', 1),
];

const hugo = new Hugo(initialTargets);
