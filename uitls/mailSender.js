const nodemailer = require("nodemailer");
require("dotenv").config();
const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.Mail_user,
                pass: process.env.Mail_password,
            },
            // port: 465,
            // host: process.env.MAIL_HOST,
        });


        let info = await transporter.sendMail({
            from: `Prabhat Saini From binmile`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,
            // text: `testing`
        });
        console.log("info");
        return info;
    }
    catch (error) {
        console.log("inside mainsender utils--", error.message);
        // console.error(error.responce.message);
        // return res.status(404).json({
        //     success: false,
        //     message: "mailsend error"
        // })
    }
}


module.exports = mailSender;