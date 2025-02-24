import Factor from "./Factor";
import MainFactor from "./Factors/MainFactor";

export default class TestBot {
    cache: { [key: string]: {value: any, factor: Factor<any>} } = {};
    dependents: { [key: string]: Set<string> } = {}; // describes which Factors depend on the Key factor (used to check for factors which need to be recalculated)
    dependencies: { [key: string]: string[] } = {}; // describes which Factors a the Key Factor depends on (used to remove dependencies)
    changes: string[] = [];
    private performanceTickCount = 0;
    private lastPerformanceCheck = Date.now();
    currentMain: number = 0;
    
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
        //check Main difference
        const main = new MainFactor().getValue(this);
        if (main !== this.currentMain) {
            this.currentMain = main;
            console.log("new main:", this.currentMain);
        }

        //check for changes
        if (Math.random() < 0.1) {
            this.changes.push("HeavyValue0");
        }

        // calc changes
        var lastTick = Date.now(); //somehow get that
        while (true) {
            if (Date.now() - lastTick >= 35) { //less than ticktime - HeavyValuetime
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
}