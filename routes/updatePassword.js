const express = require('express');
const { userModel } = require("../model/user.model");
const admin = require("../model/admin.model");
require("../db/conn");
const bcrypt = require("bcryptjs");
const mailer = require("nodemailer")

const router = express.Router();

const senderEmail = "sumeet032022@gmail.com"
var pin = 0;
const appPassword = process.env.PASSWORD;

const userDetails = {
    email: "",
    password: ""
}

// updating user password
router.post("/updatepassword", async (req, res) => {
    const { email, password } = req.body;

    const otp = Math.floor(1000 + Math.random() * 9000);
    pin = otp;

    if (!email || !password) {
        res.status(422).json({ error: "Please Enter All Feilds" })
    } else {
        try {
            userDetails.email = email;
            userDetails.password = password;

            const fetchEmail = await userModel.findOne({ email: email });

            if (fetchEmail) {

                const transporter = mailer.createTransport({
                    service: "gmail",

                    auth: {
                        user: senderEmail,
                        pass: appPassword
                    }
                });

                const mailOption = {
                    from: senderEmail,
                    to: userDetails.email,
                    subject: "Email Verification",
                    html: `<h3> ${otp} is the OTP to update your password. </h3>`
                }

                transporter.sendMail(mailOption, async (error, info) => {
                    return error ? console.log(error) : res.status(200).json({ message: "Email Sent to your Email ID" })
                })


            } else {
                return res.status(404).json({ error: "Username not Found" });
            }
        } catch (error) {
            console.log(error);
        }
    }
});

router.post("/verifypin", async (req, res) => {
    const verify = req.body;
    const verifyCode = verify.otp
    console.log(typeof (verifyCode));
    const codeOtp = Number(verifyCode);

    if (verifyCode == undefined) {
        return res.status(422).json({ error: "Please Enter OTP" })
    } else {

        if (codeOtp == pin) {

            const hashPassword = await bcrypt.hash(userDetails.password, 12)

            // updating password in db
            const newPass = await userModel.findOneAndUpdate({ email: userDetails.email }, { password: hashPassword }, { new: true });

            if (newPass) {
                return res.status(200).json({ message: "Password Changed Successfully" })
            } else {
                return res.status(500).json({ error: "Some Error Occurred" })
            }
        } else {
            return res.status(500).json({ error: "Invalid OTP" })
        }
    }

})

// updating admin password
router.post("/updateadmin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(500).json({ error: "PLease Enter all Details" });
    } else {
        try {
            const fetchEmail = await admin.findOne({ email: email });

            if (fetchEmail) {

                // hashing password
                const hashPass = await bcrypt.hash(password, 12);

                // updating password in DB
                const update = await admin.findOneAndUpdate({ email: email }, { password: hashPass }, { new: true });

                if (update) {
                    console.log(update);
                    return res.status(200).json({ message: "Password Updated Successfully" });
                } else {
                    return res.status(500).json({ error: "Some Error Occurred" })
                }
            } else {
                return res.status(404).json({ error: "Invalid Admin" })
            }

        } catch (error) {
            console.log(error);
        }
    }
})

module.exports = router;