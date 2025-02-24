import TestBot from "./TestBot";

export default abstract class Factor<T> {
    id: string
    bot: TestBot | undefined // temporary storage of bot during calculation

    constructor(id: string) {
        this.id = id;
    }

    get(factor: Factor<T>): T {
        if (!this.bot) throw new Error("No bot defined");

        if (!this.bot.dependents[factor.id]) {
            this.bot.dependents[factor.id] = new Set<string>();
        }
        this.bot.dependents[factor.id].add(this.id); // register this factor as dependent

        this.bot.dependencies[this.id].add(factor.id); //store which factors this factor depends on

        return factor.getValue(this.bot);
    }

    getValue(bot: TestBot): T {
        var value: T;
        if (bot.cache[this.id]) {
            value = bot.cache[this.id].value;
        } else {
            value = this.recalc(bot);
        }
        
        return value;
    }

    recalc(bot: TestBot) {
        this.bot = bot;

        // clear dependencies
        if(bot.dependencies[this.id]){
            for (const dependency of bot.dependencies[this.id]) {
                bot.dependents[dependency].delete(this.id); // delete previously registered dependencies
            }
        }

        bot.dependencies[this.id] = new Set<string>();

        // calc Value
        const value = this.calc(bot);
        bot.cache[this.id] = {value: value, factor: this};

        this.bot = undefined;
        return value;
    }

    abstract calc(bot: TestBot): T
}