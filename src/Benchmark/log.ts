import Bot from "../Bot";
import fs from 'fs';

function saveLog(log: {id: string, value: any}[]) {
    fs.mkdirSync("log");
    fs.writeFile("log/"+new Date().toISOString().replace(/:/g, "-")+".json", JSON.stringify(log), function(err: any) {
        if (err) {
            console.log(err);
        }
    });
}

export default function logBot(bot: Bot) {
    const log: {time: number, id: string, value: any}[] = []
    const startTime = Date.now();

    bot.events.on("factorChanged", (id: string, value: any) => {
    log.push({time: Date.now() - startTime, id, value})
    })

    bot.events.once('end', () => {
        saveLog(log)
    })

    bot.events.once('finishedActions', () => {
        saveLog(log)
    })
}
