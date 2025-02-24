import Factor from "./Factor";

export default class FactorCache {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    dependents: { [key: string]: Set<string> } = {}; // describes which Factors depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // describes which Factors a the Key Factor depends on (used to remove dependencies)
    changes: string[] = [];

    calcChanges(forMS: number){
        var lastTick = Date.now();
        while (true) {
            if (Date.now() - lastTick >= forMS) {
                if (this.changes.length === 0) {
                    return;
                }
                const factor = this.changes[0]
                if (this.dependents[factor]){
                    this.dependents[factor].forEach(dependent => this.changes.push(dependent)); // add dependents to changes
                }
                this.cache[factor].factor.recalc(this);
                this.changes.shift(); //remove recalced factor
            }
        }
    }
}