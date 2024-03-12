const express = require('express');
const connectDB = require('./db');
const User = require('./User');
const app = express();
const port = 3000;
const transporter = require('./mailer');
const fs = require('fs');
const path = require('path');

app.use(express.json()); // for parsing application/json

// Connect to the database
connectDB();

app.post('/send-email', async (req, res) => {
    try {
        const userData = await User.findOne({_id: req.body.userId});
        if (!userData) {
            return res.status(404).json({ok: false, message: 'User not found'});
        }
        const fullName = userData.profile.firstName + " " + userData.profile.lastName;
        const email = userData.email;
        const qrName = userData.qrCode;
        console.log("Name : ", fullName, " email : ", email, qrName);

        const htmlContent = fs.readFileSync(path.join(__dirname, 'registerEmailTemplate.html'), 'utf8')
            .replace('${firstName}', fullName)
            .replace('${qrCode}', qrName);

        const mailOptions = {
            from: 'nithyaa.work@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Registration Confirmation', // Subject line
            html: htmlContent // HTML body
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Email Failed', error);
                res.json({ok: false});
            } else {
                console.log('Email sent: ' + info.response);
                res.json({ok: true});
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ok: false, message: 'Server error'});
    }
});

app.listen(port, () => {
 console.log(`Server running at http://localhost:${port}`);
});
