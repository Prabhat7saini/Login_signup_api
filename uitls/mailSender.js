const nodemailer = require("nodemailer");
const {Mail_user,Mail_password}=require('../config/environmentVariable')



const mailSender = async (email, title, body) => {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: Mail_user,
                pass: Mail_password,
            },
           
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
        
        return res.status(404).json({
            success: false,
            message: "mailsend error"
        })
    }
}


module.exports = mailSender;