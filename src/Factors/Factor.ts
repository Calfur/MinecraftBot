import TestBot from "./TestBot";

export default abstract class Factor<T> {
    id: string
    bot: TestBot | undefined // temporary storage of bot during calculation
    dependencies = new Set<string>() //temporary storage of dependencies during calculations of this Factor

    constructor(id: string) {
        this.id = id;
    }

    get(factor: Factor<T>): T {
        this.dependencies.add(factor.id); // track dependencies (maybe: directly store them on bot, instead of using temporary storage)
        if (this.bot) return factor.getValue(this.bot);
        throw new Error("No bot defined");
    }

    getValue(bot: TestBot): T {
        this.bot = bot;
        var value: T;
        if (bot.cache[this.id]) {
            value = bot.cache[this.id].value;
        } else {
            value = this.recalc(bot);
        }
        this.bot = undefined;
        
        return value;
    }

    recalc(bot: TestBot) {
        this.bot = bot;

        const value = this.calc(bot);
        bot.cache[this.id] = {value: value, factor: this};

        //track others dependents
        for (const dependency of bot.dependencies[this.id]) {
            bot.dependents[dependency].delete(this.id); // delete previously registered dependencies
        }

        for (const dependency of this.dependencies) {
            if (!bot.dependents[dependency]) {
                bot.dependents[dependency] = new Set<string>();
            }
            bot.dependents[dependency].add(this.id); // register new dependencies
        }

        //track own dependencies
        bot.dependencies[this.id] = [];
        bot.dependencies[this.id].push(...this.dependencies); //store which factors this factor depends on

        this.dependencies.clear(); //clear temporary dependencies

        this.bot = undefined;
        return value;
    }

    abstract calc(bot: TestBot): T
}