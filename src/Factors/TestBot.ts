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

        // Konzept Prozess:
        // Faktoren repräsentieren einen Wert/variable und sind von 0-n Faktoren abhängig (im berechnungsprozess können andere faktoren abgerufen werden)
        //
        // faktor neu berechnen: 
        //     andere Faktoren welche davon abhängig sind als geändert markieren, 
        //     eigene Abhängigkeiten entfernen
        //     während berechnung Abhängigkeiten speichern
        //
        // tick:
        //     Faktor beste Aktion auf Änderung prüfen
        //     Status änderungen prüfen -> beeinflusste Faktoren als geändert markieren
        //     liste geänderte Faktoren abarbeiten, bis tick vorbei ist -> return (Tick ausführen lassen)
        //     Faktoren von denen keine anderen Faktoren abhängen nicht erneut berechnen (erst wenn wieder eine abhängigkeit besteht)
        // 
        // Bemerkungen:
        //     Faktoren bleiben immer gecached -> eine Faktorberechnung braucht kein aufwand für berechnen von anderen faktoren
        //     neue relevante Faktoren können Bot blockieren
        //     bei der ersten berechnung wird das ganze netzwerk zuerst berechnet
        //
        // Erweiterungen:
        //
        //     Gewichtung von Faktoren:
        //         Gewichtung von status-änderungen
        //         Gewichtung von Wichtigkeit von Faktoren
        //         -> wichtigere Faktoren zuerst berechnen
        //         löst problem, dass bei zu vielen Faktoren und Änderungen schlechte Ergebnisse entstehen
        //
        //     Schätzung Aufwand Faktoren:
        //         Bei faktoren einschätzen wie lange die berechnung dauert -> nicht starten wenn zu wenig zeit im tick übrig ist.
        //         Kann dynamisch getracked werden für faktoren typen
        //         sortierung Faktoren: Wichtigkeit * Änderung / Aufwand
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