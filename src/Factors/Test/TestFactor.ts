import TestBot from "./TestBot";

export default abstract class Factor<T> {
    id: string
    bot: TestBot | null = null // temporary storage of cache during calculation
    //TODO maybe add some libs like items/blocks/recipes here for easier use

    constructor(id: string) {
        this.id = id;
    }

    protected get<U>(factor: Factor<U>): U {
        if (!this.bot) throw new Error("No cache defined");

        if (!this.bot.dependents[factor.id]) {
            this.bot.dependents[factor.id] = new Set();
        }
        this.bot.dependents[factor.id].add(this.id); // register this factor as dependent

        if (!this.bot.dependencies[this.id]) {
            this.bot.dependencies[this.id] = new Set();
        }
        this.bot.dependencies[this.id].add(factor.id); //store which factors this factor depends on

        return factor.getValue(this.bot);
    }

    getValue(bot: TestBot): T {
        return bot.cache[this.id]?.value ?? this.recalc(bot);
    }

    recalc(bot: TestBot) {
        this.bot = bot;

        // clear dependencies
        if(bot.dependencies[this.id]){
            for (const dependency of bot.dependencies[this.id]) {
                bot.dependents[dependency].delete(this.id); // delete previously registered dependencies
            }
        }

        bot.dependencies[this.id] = new Set();

        // calc Value
        const value = this.calc(bot);
        bot.cache[this.id] = {value: value, factor: this};

        this.bot = null;
        return value;
    }

    protected abstract calc(bot: TestBot): T
}