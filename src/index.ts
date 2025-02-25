import Target from "./Target";
import OwnItem from "./Targets/OwnItem";
import Hugo from "./Bot";

const initialTargets: Target[] = [
  new OwnItem('stick', 5),
  new OwnItem('orange_dye', 1),
];

const hugo = new Hugo(initialTargets);
