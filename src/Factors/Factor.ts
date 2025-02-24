import FactorCache from "./FactorCache";

export default abstract class Factor<T> {
    id: string
    cache: FactorCache | undefined // temporary storage of cache during calculation

    constructor(id: string) {
        this.id = id;
    }

    get(factor: Factor<T>): T {
        if (!this.cache) throw new Error("No cache defined");

        if (!this.cache.dependents[factor.id]) {
            this.cache.dependents[factor.id] = new Set<string>();
        }
        this.cache.dependents[factor.id].add(this.id); // register this factor as dependent

        this.cache.dependencies[this.id].add(factor.id); //store which factors this factor depends on

        return factor.getValue(this.cache);
    }

    getValue(cache: FactorCache): T {
        var value: T;
        if (cache.cache[this.id]) {
            value = cache.cache[this.id].value;
        } else {
            value = this.recalc(cache);
        }
        
        return value;
    }

    recalc(cache: FactorCache) {
        this.cache = cache;

        // clear dependencies
        if(cache.dependencies[this.id]){
            for (const dependency of cache.dependencies[this.id]) {
                cache.dependents[dependency].delete(this.id); // delete previously registered dependencies
            }
        }

        cache.dependencies[this.id] = new Set<string>();

        // calc Value
        const value = this.calc(cache);
        cache.cache[this.id] = {value: value, factor: this};

        this.cache = undefined;
        return value;
    }

    abstract calc(cache: FactorCache): T
}