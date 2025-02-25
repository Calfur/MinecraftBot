import FactorCache from "./FactorCache";

export default abstract class Factor<T> {
    id: string
    cache: FactorCache | undefined // temporary storage of cache during calculation

    constructor(id: string) {
        this.id = id;
    }

    protected get<U>(factor: Factor<U>): U {
        if (!this.cache) throw new Error("No cache defined");

        if (!this.cache.dependents[factor.id]) {
            this.cache.dependents[factor.id] = new Set();
        }
        this.cache.dependents[factor.id].add(this.id); // register this factor as dependent

        if (!this.cache.dependencies[this.id]) {
            this.cache.dependencies[this.id] = new Set();
        }
        this.cache.dependencies[this.id].add(factor.id); //store which factors this factor depends on

        return factor.getValue(this.cache);
    }

    getValue(cache: FactorCache): T {
        return cache.cache[this.id]?.value ?? this.recalc(cache);
    }

    recalc(cache: FactorCache) {
        this.cache = cache;

        // clear dependencies
        if(cache.dependencies[this.id]){
            for (const dependency of cache.dependencies[this.id]) {
                cache.dependents[dependency].delete(this.id); // delete previously registered dependencies
            }
        }

        cache.dependencies[this.id] = new Set();

        // calc Value
        const value = this.calc(cache);
        cache.cache[this.id] = {value: value, factor: this};

        this.cache = undefined;
        return value;
    }

    protected abstract calc(cache: FactorCache): T
}