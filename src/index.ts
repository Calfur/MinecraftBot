import Target from "./Targets/Target";
import OwnItem from "./Targets/OwnItem";
import Hugo from "./Hugo";

const initialTargets: Target[] = [
  new OwnItem('cobblestone'),
  // new OwnItem('orange_dye'),
  // new OwnItem('sandstone_slab'),
];

const hugo = new Hugo(initialTargets);
