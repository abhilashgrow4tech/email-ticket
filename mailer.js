const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
 service: 'gmail', // Use Gmail for this example
 auth: {
    user: 'nithyaa.work@gmail.com', // Your email address
    pass: 'adms yfps pihg azje' // Your email password
 }
});

module.exports = transporter;
