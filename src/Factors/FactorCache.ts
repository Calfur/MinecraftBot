import Bot from "../Bot";
import SortedArray from "../lib/SortedArray";
import Factor from "./Factor";

export default class FactorCache {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    dependents: { [key: string]: Set<string> } = {}; // Factors which depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // Factors on which the Key Factor depends on (used to remove dependencies)
    //TODO include calcTime into sorting of changes
    changes: SortedArray<Change> = new SortedArray<Change>((a: Change, b: Change) => a.difference * a.importance - b.difference * b.importance); // Factors which need to be recalculated due to assumed changes§

    calcChanges(forMS: number, bot: Bot) {
        const endTime = Date.now() + forMS;
        
        while (Date.now() < endTime) {
            const change = this.changes.pop()
            if (!change) break;
            const { id, importance } = change;
        
            const factor = this.cache[id].factor;
            if (!factor) continue;
        
            // if (factor.calcTime() > timeLeft) {// TODO somehow calc other one instead + better not pop if takes to long
            //     this.changes.insert(change);
            //     break;
            // };

            factor.recalc(this, bot);
        
            //TODO only change dependents if the value is diffrent
            if (this.dependents[id]){
                this.dependents[id].forEach(dependent => this.addChange(dependent, importance)); // add dependents to changes
            }
        }
    }
    
    addChange(factor: string, difference: number) {
        if (!this.cache[factor]) return;

        difference = Math.min(difference, 1);
        const previous = this.changes.getById(factor);
        
        if (previous) {
            this.changes.update(previous, {...previous, difference: previous.difference + (1-previous.difference) * difference});
        } else {
            this.changes.insert({id: factor, difference, importance: 1}); //default importance should be 0, but importance not yet assigned to factors
        }
    }

    addChangeRegEx(factor: RegExp, diffrence: number) { // diffrence from 0-1 (equals the chance that the factor changes, when recalculated)
        for (const factorId of Object.keys(this.cache).filter(factorId => factor.test(factorId))) {
            this.addChange(factorId, diffrence);
        }
    }
}

interface Change { //represents a change of a factor
    id: string; //factorId
    difference: number;
    importance: number;
}