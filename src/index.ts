import Target from "./Targets/Target";
import OwnItem from "./Targets/OwnItem";
import Hugo from "./Hugo";

const initialTargets: Target[] = [
  new OwnItem('orange_dye'),
  new OwnItem('coal_block'),
];

const hugo = new Hugo(initialTargets);
