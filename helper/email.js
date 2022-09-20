const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "diywithicha@gmail.com",
        pass: "rencaiqrvhfvstfe"
    },
    tls: {rejectUnauthorized: false}
});

exports.send = async (recipient, subject, html, cc = "", bcc = "") => {
    try {
        const mailOption = {
            from: "diywithicha@gmail.com",
            to: recipient,
            subject: subject,
            html,
            cc,
            bcc
        };
    
        transporter.sendMail(mailOption).catch(err => {throw err});
    } catch (error) {
        console.log(error)
    }
}