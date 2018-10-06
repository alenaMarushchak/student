const nodemailer = require("nodemailer");

class Mailer {
    constructor() {
        this.smtpTransport = nodemailer.createTransport(
            {
                host  : 'smtp.gmail.com',
                secure: false,
                auth  : {
                    user: "maruschak68@gmail.com",
                    pass: "000999qqqfinger"
                }
            });


        this.FROM = 'studentmanagementsystem@blurdybloop.com'
    }

    sendMail(opts) {
        const {subject = "Hello ✔", html = "<b>Hello world ✔</b>", email} = opts;

        const mailOptions = {
            from: this.FROM,
            to  : email,
            subject,
            html
        };


        this.smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });
    }

    sendInvite(email, params) {
        return this.sendMail({
            email,
            subject: 'You are invited to Student Management System',
            //TODO add html templates
        })
    }
}

module.exports = new Mailer();