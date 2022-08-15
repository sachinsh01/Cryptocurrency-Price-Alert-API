require('dotenv').config({ path: require("find-config")(".env") });
const amqp = require("amqplib");

module.exports.publish = async (mailObj) => {
    const msgBuffer = Buffer.from(JSON.stringify(mailObj));

    try {
        const connection = await amqp.connect(process.env.AmqpURL);
        const channel = await connection.createChannel();
        await channel.assertQueue("alerts");
        await channel.sendToQueue("alerts", msgBuffer);
        await channel.close();
        await connection.close();
    }

    catch (error) {
        console.log(error);
    }
}