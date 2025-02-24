import Factor from "./Factor";

export default class FactorCache {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    // not sure if set's make sense (performance, reasonability, etc.)
    dependents: { [key: string]: Set<string> } = {}; // describes which Factors depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // describes which Factors a the Key Factor depends on (used to remove dependencies)
    changes: string[] = [];

    calcChanges(forMS: number){
        var startTime = Date.now();
        while (this.changes.length > 0 && Date.now() - startTime < forMS) {
            const factor = this.changes[0]
            if (this.dependents[factor]){
                this.dependents[factor].forEach(dependent => this.changes.push(dependent)); // add dependents to changes
            }
            this.cache[factor].factor.recalc(this);
            this.changes.shift(); //remove recalced factor
        }
    }

    changeFactor(factor: string, value: any) {
        this.cache[factor].value = value;
        this.dependents[factor].forEach(dependent => this.changes.push(dependent)); //also update dependents
    }
}