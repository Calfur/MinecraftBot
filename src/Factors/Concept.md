## Konzept Prozess:
Faktoren repräsentieren einen Wert/variable und sind von 0-n Faktoren abhängig (im berechnungsprozess können andere faktoren abgerufen werden)

**faktor neu berechnen:** 
    andere Faktoren welche davon abhängig sind als geändert markieren, 
    eigene Abhängigkeiten entfernen
    während berechnung Abhängigkeiten speichern

**tick:**
    Faktor beste Aktion auf Änderung prüfen
    Status änderungen prüfen -> beeinflusste Faktoren als geändert markieren
    liste geänderte Faktoren abarbeiten, bis tick vorbei ist -> return (Tick ausführen lassen)
    Faktoren von denen keine anderen Faktoren abhängen nicht erneut berechnen (erst wenn wieder eine abhängigkeit besteht)

**Bemerkungen:**
    Faktoren bleiben immer gecached -> eine Faktorberechnung braucht kein aufwand für berechnen von anderen faktoren
    neue relevante Faktoren können Bot blockieren
    bei der ersten berechnung wird das ganze netzwerk zuerst berechnet

**Erweiterungen:**

    Gewichtung von Faktoren:
        Gewichtung von status-änderungen
        Gewichtung von Wichtigkeit von Faktoren
        -> wichtigere Faktoren zuerst berechnen
        löst problem, dass bei zu vielen Faktoren und Änderungen schlechte Ergebnisse entstehen

    Schätzung Aufwand Faktoren:
        Bei faktoren einschätzen wie lange die berechnung dauert -> nicht starten wenn zu wenig zeit im tick übrig ist.
        Kann dynamisch getracked werden für faktoren typen
        sortierung Faktoren: Wichtigkeit * Änderung / Aufwand

**implementation Decisonalgorythm**

Maybe have state-info as predefined Factors (e.g. health, inventory)

Some kinda need to be calced from bot (e.g. findBlocks)

Difficulties:
- avoid Loops (crafting, place-break, etc.)