import { Bot } from "mineflayer";

// Use `/gamerule sendCommandFeedback false` to disable command feedback

export default class TpsScoreboard {
  private bot: Bot;
  private performanceTickCount = 0;
  private lastPerformanceCheck = Date.now();

  constructor(bot: Bot) {
    this.bot = bot;
    this.bot.chat('/scoreboard objectives add TPS dummy "TPS"');
    this.bot.chat('/scoreboard objectives setdisplay sidebar TPS');
  }

  tick() {
    this.performanceTickCount++;
    const now = Date.now();

    if (now - this.lastPerformanceCheck >= 1000) {
      const tps = Math.round(this.performanceTickCount / ((now - this.lastPerformanceCheck) / 1000));
      this.bot.chat(`/scoreboard players set ${this.bot.username} TPS ${tps}`);
      this.performanceTickCount = 0;
      this.lastPerformanceCheck = now;
    }
  }
}
