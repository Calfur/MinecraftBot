## Local setup

- Open a minecraft world in `1.21.1`. A list of supported versions by Mineflayer can be found [here](https://github.com/PrismarineJS/mineflayer/blob/master/lib/version.js#L1)
- Open the game to lan with the port `25565`
- Run `npm i`
- Run `npm run start`

## hint performance tracking
use console.time("key")
and console.endtime("key")

## improvements on Algorythm

Accuracy of all calculations

importance of possible Actions depending on alterantives (importance = FastestWayEffortFuture / OwnEffortFuture)
-> include in action sorting (futureEffort / currentEffort * importance: determines Gain from running action now)

Factor calcTime estimation

add importance and %of change to changes for sorting (importance * %change / calcEffort: determines how helpfull a calculation is)
