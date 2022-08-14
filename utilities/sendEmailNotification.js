const nodeMailer = require("nodemailer");
require('dotenv').config({path: require("find-config")(".env")});

const sendEmail = async (mailObj) => {
    const {from, recipients, subject, message} = mailObj;

    try {

        //SendInBlue
        /* const transporter = nodeMailer.createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            auth: {
                user: process.env.SendInBlueID,
                pass: process.env.SendInBluePASS
            }
        }); */

        //SendGrid
        const transporter = nodeMailer.createTransport({
            host: "smtp.sendgrid.net",
            port: 587,
            auth: {
                user: "apikey",
                pass: process.env.SendGrid
            }
        });

        let mailStatus = await transporter.sendMail({
            from: from,
            to: recipients,
            subject: subject,
            text: message
        });
        
        return `Messagge sent: ${mailStatus.messageId}`;
    }

    catch(error) {
        console.error(error);

        throw new Error(`Something went wrong in the sendmail method. Error: ${error.message}`);
    }
}

const mailObj = {
  //from: "the.sachins18@gmail.com",
  from: "sachin.sh1820@gmail.com",
  recipients: ["sachin.sh1800@gmail.com"],
  subject: "Sending email by nodejs",
  message: "Hello World;",
}


sendEmail(mailObj).then((res) => {
  console.log(res);
});

module.exports.sendEmail = sendEmail;