const express = require("express");
const { userModel } = require("../model/user.model");
const router = express.Router();
const orderModel = require("../model/order.model");
const mailer = require("nodemailer");

router.post("/order", async (req, res) => {
    let { amount, courseId, courseTitle, userId, userName, email, transactionid, img } = req.body;
    const date = new Date();
    const dateTime = date.toLocaleString()
    try {
        // adding course to user db
        const newOrder = await orderModel.create({
            courseId: courseId,
            title: courseTitle,
            price: amount,
            time: dateTime,
            userId: userId,
            userName,
            transactionid,
            img,
            email
        });
        try {
            const template = `
                <div style="background-color: #170F1E; color:#fff; padding: 1.5rem; border-radius: 10px;">
                    <h1 style="font-family: Gill Sans, sans-serif;
                    font-weight: 500; color: #fff;">Coursi<span style="color: orange;">.</span></h1>
                    <h2 style="font-family: Gill Sans, sans-serif;
                    font-weight: 500; color: #fff;">Order is submitted for confirmation.</h2>
                    <h3 style="font-family: Gill Sans, sans-serif;
                    font-weight: 400; color: #fff">Course Title: ${courseTitle}</h3>
                    <h3 style="font-family: Gill Sans, sans-serif;
                    font-weight: 400; color: #fff">Corse Amount: ${amount} RS</h3>
                    <h5 style="font-family: Gill Sans, sans-serif;
                    font-weight: 400; color: rgb(228, 82, 82)">Note: The order will be confirmed within 24 hr.</h5>
                    <br/><br/>
                    Regards,<br/>
                    Team Coursi 2022
                    </h3>
                </div>
            `
            const template2 = `
                <div style="background-color: #170F1E; color:#fff; padding: 1.5rem; border-radius: 10px;">
                    <h1 style="font-family: Gill Sans, sans-serif;
                    font-weight: 500; color: #fff;">Coursi<span style="color: orange;">.</span></h1>
                    <h2 style="font-family: Gill Sans, sans-serif;
                    font-weight: 500; color: #fff;">New Order Recived.</h2>
                    <h3 style="font-family: Gill Sans, sans-serif;
                    font-weight: 400; color: #fff">Course Title: ${courseTitle}</h3>
                    <h3 style="font-family: Gill Sans, sans-serif;
                    font-weight: 400; color: #fff">Corse Amount: ${amount} RS</h3><br/><br/>
                    
                    <a href="http://admin.localhost:5173/" target="_blank" style="color: #fff; background-color: orange; padding: 1rem 2.5rem; text-decoration: none; border-radius: 2rem; font-size: 1rem; font-weight: 600;">Go To Portal</a>
                    <br/><br/><br/>
                    Regards,<br/>
                    Team Coursi 2022
                    </h3>
                </div>
            `

            const sender = (element, template, sub) => {
                const senderMail = "tradelal.com@gmail.com";
                const appPassword = process.env.PASSWORD;
                const transporter = mailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: senderMail,
                        pass: appPassword,
                    }
                });

                const mailOption = {
                    from: senderMail,
                    to: element,
                    subject: sub,
                    html: template,
                    text: template,
                }

                transporter.sendMail(mailOption, async (error, info) => {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Follow Up Email Sent");
                    }
                })
            }

            sender(email, template, "Order is submitted for confirmation.")
            sender("bot.tradelal@gmail.com", template2, "New Order Recived.")
        } catch (error) {
            console.log(error);
        }
        return res.json({ message: "Payment Successfull", success: true })

    } catch (error) {
        console.log("Error: ", error);
        res.json({
            message: "Payment Failed",
            success: false
        })
    }
});


module.exports = router