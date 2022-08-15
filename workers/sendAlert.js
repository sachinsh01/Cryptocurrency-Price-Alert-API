require('dotenv').config({ path: require("find-config")(".env") });
const CronJob = require("cron").CronJob;
const mongoose = require("mongoose");

const Alert = require("../models/alert");

const { currentPrice } = require("../utilities/currentPrice");
const { publish } = require("../utilities/publisher");

//MongoDB Connect
const dbUrl = "mongodb://localhost:27017/Krypto-App" || process.env.DB_URL;
mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!"));
db.once("open", () => {
    console.log("Database Connected");
});

const sendAlert = new CronJob("*/2 * * * * *", async function () {
    let priceObj = await currentPrice();

    if (priceObj.error)
        return;

    let price = priceObj.data;
    const alerts = await Alert.find({ status: "Created" });

    alerts.forEach((alert) => {
        
        if (alert.price == 240018) {

            recipients = alert.email;
            subject = `Bitcoint is UP!`;
            message = `Price of Bitcoin has just exceeded your alert price of ${alert.price} USD. Current price is ${price} USD.`;
            publish({recipients, subject, message});
            alert.status = "Triggered"
            alert.save();
        }
    })

});

sendAlert.start();

/* const mailObj = {
    from: "sachin.sh1820@gmail.com",
    recipients: ["sachin.sh1800@gmail.com"],
    subject: "Sending email by nodejs",
    message: "Hello World;",
} */

//publish(mailObj);

//module.exports.sendAlert = sendAlert;