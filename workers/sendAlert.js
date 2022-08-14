const CronJob = require("cron").CronJob;
let Queue = require("bull");

const {currentPrice} = require("../utilities/currentPrice");

let sendAlert = new CronJob("*/25 * * * * *", async function() {
    let price = await currentPrice();

    if(price.error)
        return;

    
})