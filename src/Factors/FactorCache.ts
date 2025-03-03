import Bot from "../Bot";
import Factor from "./Factor";

export default class FactorCache {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    dependents: { [key: string]: Set<string> } = {}; // Factors which depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // Factors on which the Key Factor depends on (used to remove dependencies)
    changes: Set<string> = new Set<string>(); // Factors which need to be recalculated due to assumed changes

    calcChanges(forMS: number, bot: Bot) {
        const startTime = Date.now();
        
        while (this.changes.size > 0 && Date.now() - startTime < forMS) {
            const factorId = this.changes.values().next().value ?? ""; // "" should not be possible to reach
            this.changes.delete(factorId); //remove recalced factor
        
            const factor = this.cache[factorId].factor;
            if (!factor) continue;
        
            factor.recalc(this, bot);
        
            //TODO only change dependents if the value is diffrent
            if (this.dependents[factorId]){
                this.dependents[factorId].forEach(dependent => this.changes.add(dependent)); // add dependents to changes
            }
        }
    }
    
    addChange(regex: RegExp) {
        for (const factorId of Object.keys(this.cache).filter(factorId => regex.test(factorId))) {
            this.changes.add(factorId);
        }
    }
}