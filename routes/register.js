const express = require("express");
const mailer = require("nodemailer");
require("../db/conn");
const { userModel, contactModel } = require("../model/user.model");
const admin = require("../model/admin.model")

const router = express.Router();

const userDetails = {
    referedBy: "",
    username: "",
    to: "",
    password: "",
    referal_id: "",
    myLearning: "",
    code: "",
    phone: "",
}

const senderMail = "tradelal.com@gmail.com";

var verifyOTP = 0;

const appPassword = process.env.PASSWORD;


router.post("/registerUser", async (req, res) => {

    const otp = Math.floor(1000 + Math.random() * 9000);
    verifyOTP = otp;
    console.log(verifyOTP);

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const code = req.body.code;
    const phone = req.body.phone;
    const referedBy = req.body.refer;

    userDetails.username = username;
    userDetails.to = email;
    userDetails.password = password;
    userDetails.code = code;
    userDetails.phone = phone;

    if (!username || !email || !password || !code || !phone) {
        return res.status(500).json({ error: "Please Enter all Fields" })
    }

    try {

        const fetchEmail = await userModel.findOne({ username: userDetails.username });

        if (fetchEmail) {
            return res.status(500).json({ error: "User Already Registred" })
        } else {

            // seaching referal id in URL
            var refer = req.query.refer;

            if (refer) {

                const transporter = mailer.createTransport({
                    service: "gmail",

                    auth: {
                        user: senderMail,
                        pass: appPassword
                    }
                });

                const mailOption = {
                    from: senderMail,
                    to: userDetails.to,
                    subject: "Email Verification",
                    html: `<h3> ${otp} is the OTP to verify your Email </h3>`
                }

                transporter.sendMail(mailOption, async (error, info) => {
                    return error ? console.log(error) : res.status(200).json({ message: "Email Sent to your Email ID" })
                })

            } else {
                const transporter = mailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: senderMail,
                        pass: appPassword
                    }
                });

                const mailOption = {
                    from: senderMail,
                    to: userDetails.to,
                    subject: "Email Verification",
                    html: `<h3> ${otp} is the OTP to verify your Email </h3>`
                }

                transporter.sendMail(mailOption, async (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.status(200).json({ message: "Email Sent to your Email ID" })
                    }
                })


            }


        }
    } catch (err) {
        console.log(err);
    }
});

router.post("/verify", async (req, res) => {
    const verify = req.body;
    const verifyCode = verify.otp
    console.log(typeof (verifyCode));
    const codeOtp = Number(verifyCode);

    if (codeOtp == verifyOTP) {
        console.log('verified');

        const code = userDetails.code;
        const phone = userDetails.phone;
        const username = userDetails.username;
        const email = userDetails.to;
        const password = userDetails.password;
        const refer = userDetails.referedBy;

        if (refer != "") {
            const contact = new contactModel({ code, phone });

            const customer = new userModel({ referedBy: refer, username, email, password, contact });

            customer.contact.push(contact);
            const result = await customer.save();

            if (result) {
                console.log(result);
                res.status(200).json({ message: "Regestration Successful . Please Login" });
            } else {
                res.status(422).json({ error: "Error Ocurred !!" })
            }
        }

        const contact = new contactModel({ code, phone });

        const customer = new userModel({ username, email, password });

        customer.contact.push(contact);
        const result = await customer.save();
        if (result) {
            const transporter = mailer.createTransport({
                service: "gmail",
                auth: {
                    user: senderMail,
                    pass: appPassword
                }
            });

            const mailOption = {
                from: senderMail,
                to: userDetails.to,
                subject: "Email Verification",
                html: `<h3> Your Email is Successfully Verified </h3>`
            }

            transporter.sendMail(mailOption, async (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Follow Up Email Sent");
                }
            })

            return res.status(200).json({ message: "Regestration Successful" });
        } else {
            return res.status(422).json({ error: "Error Ocurred !!" })
        }

    } else {
        console.log(codeOtp, typeof codeOtp);
        return res.status(500).json({ error: "Invalid OTP" })
    }
})

router.post("/addAdmin", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(422).json({ error: "Please Fill All Required Feilds" })
    } else {
        const fetchAdmin = await admin.findOne({ username: username });

        if (fetchAdmin) {
            res.status(422).json({ error: "Admin Already Registered" });
        } else {
            const add = new admin({ username, email, password });

            const result = await add.save();

            if (result) {
                res.status(200).json({ message: "Admin Regestered" });
            } else {
                res.status(422).json({ error: "Error Occurred in Adding" })
            }
        }
    }
})

module.exports = router