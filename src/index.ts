import Target from "./Targets/Target";
import OwnItem from "./Targets/OwnItem";
import Hugo from "./Hugo";

const initialTargets: Target[] = [
  new OwnItem('cobblestone', 1),
  new OwnItem('orange_dye', 1),
  new OwnItem('sandstone_slab', 6),
];

const hugo = new Hugo(initialTargets);
