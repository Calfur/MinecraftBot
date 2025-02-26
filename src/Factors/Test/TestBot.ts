import Factor from "./TestFactor";
import MainFactor from "./MainFactor";

export default class TestBot {
    private performanceTickCount = 0;
    private lastPerformanceCheck = Date.now();
    currentMain: string = "";
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {}; //Factor stored to get Factor from id again
    dependents: { [key: string]: Set<string> } = {}; // describes which Factors depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: Set<string> } = {}; // describes which Factors a the Key Factor depends on (used to remove dependencies)
    changes: Set<string> = new Set<string>();
    
    constructor() {
        var lastTick = Date.now();
        while (true) {
            if (Date.now() - lastTick >= 50) { //20 per second
                lastTick = Date.now();
                this.runTick();
                this.trackTps();
            }
        }
    }

    runTick() {
        //check for changes
        if (Math.random() < 0.1) {
            this.changes.add("HeavyValue0");
        }
        
        // calc changes
        this.calcChanges(35); //to make sure it doesn't take too long

        //check if Main value changed
        const main = new MainFactor().getValue(this);
        if (main !== this.currentMain) {
            this.currentMain = main;
            console.log("new main:", this.currentMain);
        }
    }

    trackTps() {
        this.performanceTickCount++;
        const now = Date.now();

        if (now - this.lastPerformanceCheck >= 1000) {
            const tps = Math.round(this.performanceTickCount / ((now - this.lastPerformanceCheck) / 1000));
            console.log(tps);
            this.performanceTickCount = 0;
            this.lastPerformanceCheck = now;
        }
    }

    calcChanges(forMS: number){
        const startTime = Date.now();
        
        while (this.changes.size > 0 && Date.now() - startTime < forMS) {
            const factorId = this.changes.values().next().value ?? ""; // "" should not be possible to reach
            this.changes.delete(factorId); //remove recalced factor

            const factor = this.cache[factorId].factor;
            if (!factor) continue;

            factor.recalc(this);

            //TODO only change dependents if the value changed
            if (this.dependents[factorId]){
                this.dependents[factorId].forEach(dependent => this.changes.add(dependent)); // add dependents to changes
            }
        }
    }

    changeFactor(factor: string, value: any) {
        this.cache[factor].value = value;
        if (this.dependents[factor]) {
            this.dependents[factor].forEach(dependent => this.changes.add(dependent)); //also update dependents
        }
    }
}