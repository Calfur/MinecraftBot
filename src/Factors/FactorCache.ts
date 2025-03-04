import Bot from "../Bot";
import Factor from "./Factor";

export default class FactorCache {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    dependents: { [key: string]: Set<string> } = {}; // Factors which depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // Factors on which the Key Factor depends on (used to remove dependencies)
    changes: { factorId: string, weight: number }[] = [];; // Factors which need to be recalculated due to assumed changes

    sortChanges() {
        this.changes.sort((a, b) => b.weight - a.weight); // Sort by weight, highest first
    }

    calcChanges(forMS: number, bot: Bot) {
        const startTime = Date.now();
        
        while (this.changes.length > 0 && Date.now() - startTime < forMS) {
            const { factorId, weight } = this.changes.shift()!;
        
            const factor = this.cache[factorId].factor;
            if (!factor) continue;
        
            factor.recalc(this, bot);
        
            //TODO only change dependents if the value is diffrent
            if (this.dependents[factorId]){
                this.dependents[factorId].forEach(dependent => this.addChange(dependent, weight)); // add dependents to changes
            }
            this.sortChanges();
        }
    }
    
    addChange(factor: string, weight: number) {
        const previous = this.changes.find(change => change.factorId === factor);
        if (previous) {
            previous.weight += weight;
        } else {
            this.changes.push({factorId: factor, weight: weight});
        }
    }

    addChangeRegEx(factor: RegExp, weight: number) {
        for (const factorId of Object.keys(this.cache).filter(factorId => factor.test(factorId))) {
            this.addChange(factorId, weight);
        }
    }
}