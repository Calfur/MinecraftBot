import Bot from "../Bot";
import SortedArray from "../lib/SortedArray";
import Factor from "./Factor";

export default class FactorCache {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    dependents: { [key: string]: Set<string> } = {}; // Factors which depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // Factors on which the Key Factor depends on (used to remove dependencies)
    changes: SortedArray<Change> = new SortedArray<Change>((a: Change, b: Change) => a.difference * a.importance - b.difference * b.importance); // Factors which need to be recalculated due to assumed changes§

    calcChanges(forMS: number, bot: Bot) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < forMS) {
            const change = this.changes.pop()
            if (!change) break;
            const { factorId, importance } = change;
        
            const factor = this.cache[factorId].factor;
            if (!factor) continue;
        
            factor.recalc(this, bot);
        
            //TODO only change dependents if the value is diffrent
            if (this.dependents[factorId]){
                this.dependents[factorId].forEach(dependent => this.addChange(dependent, importance)); // add dependents to changes
            }
        }
    }
    
    addChange(factor: string, importance: number) {
        const previous = this.changes.getItems().find(change => change.factorId === factor);
        if (previous) {
            this.changes.update(previous, {...previous, importance: previous.importance + importance});
        } else {
            this.changes.insert({factorId: factor, difference: 1, importance: importance});
        }
    }

    addChangeRegEx(factor: RegExp, importance: number) {
        for (const factorId of Object.keys(this.cache).filter(factorId => factor.test(factorId))) {
            this.addChange(factorId, importance);
        }
    }
}

interface Change {
    factorId: string;
    difference: number;
    importance: number;
}