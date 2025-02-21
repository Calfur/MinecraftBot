import TestBot from "./TestBot";

export default abstract class Factor<T> {
    id: string
    bot: TestBot | undefined
    dependencies = new Set<string>()

    constructor(id: string) {
        this.id = id;
    }

    getFactor(factor: Factor<T>): T {
        this.dependencies.add(factor.id);
        if (this.bot) return factor.getValue(this.bot);
        throw new Error("No bot defined");
    }

    getValue(bot: TestBot): T {
        this.bot = bot;
        var value: T;
        if (bot.cache[this.id]) {
            value = bot.cache[this.id].value;
        } else {
            value = this.calc(bot);
            bot.cache[this.id] = {value, dependencies: []};
        }
        this.bot = undefined;
        this.dependencies.clear();
        return value;
    }

    abstract calc(bot: TestBot): T
}