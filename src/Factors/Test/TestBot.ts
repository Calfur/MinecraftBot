import FactorCache from "../FactorCache";
import MainFactor from "./MainFactor";

export default class TestBot extends FactorCache {
    private performanceTickCount = 0;
    private lastPerformanceCheck = Date.now();
    currentMain: string = "";
    
    constructor() {
        super();
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
}