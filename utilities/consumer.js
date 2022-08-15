require('dotenv').config({ path: require("find-config")(".env") });
const amqp = require("amqplib");
const nodeMailer = require("nodemailer");

const { sendEmail } = require("../utilities/sendEmailNotification");

const consume = async () => {

    try {
        const connection = await amqp.connect(process.env.AmqpURL);
        const channel = await connection.createChannel();
        await channel.assertQueue("alerts");
        channel.consume("alerts", message => {
            const input = JSON.parse(message.content.toString());
            console.log(input);
            sendEmail(input).then((res) => {
                console.log(res);
            });;
            channel.ack(message);
        })
    }

    catch (error) {
        console.log(error);
    }

}

consume();

/* const mailObj = {
  //from: "the.sachins18@gmail.com",
  from: "sachin.sh1820@gmail.com",
  recipients: ["sachin.sh1800@gmail.com"],
  subject: "Sending email by nodejs",
  message: "Hello World;",
} */

/* sendEmail({
  recipients: 'sachin.sh1800@gmail.com',
  subject: 'Bitcoint is UP!',
  message: 'Price of Bitcoin has just exceeded your alert price of 240018 USD. Current price is 240015 USD.'
}); */