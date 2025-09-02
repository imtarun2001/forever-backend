



const nodeMailer = require('nodemailer');
require('dotenv').config();




const mail = async (email, subject, html) => {
    try {
        const transporter = nodeMailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS
                }
            }
        );
        const info = await transporter.sendMail(
            {
                from: `Forever🤍🛍️ || ${process.env.MAIL_USER}`,
                to: email,
                subject: subject,
                html: html
            }
        );

        return info;

    } catch (error) {
        console.log(`Error in mail`);
        console.log(error);
        process.exit(1);
    }
}




module.exports = mail;