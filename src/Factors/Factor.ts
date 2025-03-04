import Bot from "../Bot";
import FactorCache from "./FactorCache";

export default abstract class Factor<T> {
    id: string
    bot: Bot | null = null
    //TODO maybe add some libs like items/blocks/recipes here for easier use

    constructor(id: string) {
        this.id = id;
    }

    private getFactor<U>(factor: Factor<U>): U {
        if (!this.bot) throw new Error("No Bot defined");

        if (!this.bot.cache.dependents[factor.id]) {
            this.bot.cache.dependents[factor.id] = new Set();
        }
        this.bot.cache.dependents[factor.id].add(this.id); // register this factor as dependent

        if (!this.bot.cache.dependencies[this.id]) {
            this.bot.cache.dependencies[this.id] = new Set();
        }
        this.bot.cache.dependencies[this.id].add(factor.id); //store which factors this factor depends on

        return factor.getValue(this.bot.cache, this.bot);
    }

    getValue(cache: FactorCache, Bot: Bot): T { //TODO try .valueOf() for auto conversion
        return cache.cache[this.id]?.value ?? this.recalc(cache, Bot);
    }

    recalc(cache: FactorCache, Bot: Bot): T {
        this.bot = Bot;

        // clear dependencies
        if(cache.dependencies[this.id]){
            for (const dependency of cache.dependencies[this.id]) {
                cache.dependents[dependency].delete(this.id); // delete previously registered dependencies
            }
        }

        cache.dependencies[this.id] = new Set();

        // calc Value
        const value = this.calc(this.bot, this.getFactor.bind(this));
        this.bot.emit("factorChanged", this.id, value);
        cache.cache[this.id] = {value: value, factor: this};
        return value;
    }

    protected abstract calc(Bot: Bot, get: (factor: Factor<T>) => T): T

    toJSON(): any {
        return this.id
    }
}