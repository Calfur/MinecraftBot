import Target from "./Targets/Target";
import GetItem from "./Targets/GetItem";
import Hugo from "./Hugo";

const initialTargets: Target[] = [
  new GetItem('orange_dye'),
  new GetItem('coal_block'),
];

const hugo = new Hugo(initialTargets);
