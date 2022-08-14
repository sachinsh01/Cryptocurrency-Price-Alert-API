const CronJob = require("cron").CronJob;
let Queue = require("bull");

const { currentPrice } = require("../utilities/currentPrice");
const { sendEmail } = require("../utilities/sendEmailNotification");

let sendAlert = new CronJob("*/25 * * * * *", async function () {
    let price = await currentPrice();

    if (price.error)
        return;


})