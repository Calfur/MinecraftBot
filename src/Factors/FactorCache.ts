import Factor from "./Factor";

export default class FactorCache {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    // not sure if set's make sense (performance, reasonability, etc.)
    dependents: { [key: string]: Set<string> } = {}; // describes which Factors depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // describes which Factors a the Key Factor depends on (used to remove dependencies)
    changes: Set<string> = new Set<string>();

    calcChanges(forMS: number){
        var startTime = Date.now();
        while (this.changes.size > 0 && Date.now() - startTime < forMS) {
            const factor = this.changes.values().next().value ?? ""; // "" should not be possible to reach
            if (this.dependents[factor]){
                this.dependents[factor].forEach(dependent => this.changes.add(dependent)); // add dependents to changes
            }
            this.cache[factor].factor.recalc(this);
            this.changes.delete(factor); //remove recalced factor
        }
    }

    changeFactor(factor: string, value: any) {
        this.cache[factor].value = value;
        this.dependents[factor].forEach(dependent => this.changes.add(dependent)); //also update dependents
    }
}