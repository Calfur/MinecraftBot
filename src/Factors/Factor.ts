import FactorCache from "./FactorCache";

export default abstract class Factor<T, Data> {
    id: string
    cache: FactorCache | null = null // temporary storage of cache during calculation
    data: Data | null = null
    //TODO maybe add some libs like items/blocks/recipes here for easier use

    constructor(id: string) {
        this.id = id;
    }

    private getFactor<U>(factor: Factor<U, Data>): U {
        if (!this.cache) throw new Error("No cache defined");
        if (!this.data) throw new Error("No data defined");

        if (!this.cache.dependents[factor.id]) {
            this.cache.dependents[factor.id] = new Set();
        }
        this.cache.dependents[factor.id].add(this.id); // register this factor as dependent

        if (!this.cache.dependencies[this.id]) {
            this.cache.dependencies[this.id] = new Set();
        }
        this.cache.dependencies[this.id].add(factor.id); //store which factors this factor depends on

        return factor.getValue(this.cache, this.data);
    }

    getValue(cache: FactorCache, data: Data): T {
        return cache.cache[this.id]?.value ?? this.recalc(cache, data);
    }

    recalc(cache: FactorCache, data: Data): T {
        this.cache = cache;
        this.data = data;

        // clear dependencies
        if(cache.dependencies[this.id]){
            for (const dependency of cache.dependencies[this.id]) {
                cache.dependents[dependency].delete(this.id); // delete previously registered dependencies
            }
        }

        cache.dependencies[this.id] = new Set();

        // calc Value
        const value = this.calc(this.data, this.getFactor.bind(this));
        cache.cache[this.id] = {value: value, factor: this};

        this.cache = null;
        return value;
    }

    protected abstract calc(data: Data, get: (factor: Factor<any, Data>) => any): T
}