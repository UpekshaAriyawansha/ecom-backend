const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async(data, req, res)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,//587
        secure: true,//false
        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: "process.env.MAIL_ID",
          pass: "process.env.MAIL_PASSWORD",
        },
      });
      
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Hello 👻" <abc@example.com>', // sender address
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.html, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
}});

module.exports = sendEmail;