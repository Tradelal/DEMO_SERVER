const express = require("express");
const { userModel } = require("../model/user.model");
const router = express.Router();
const purchaseModel = require("../model/purchase.model");
const orderModel = require("../model/order.model");
const mailer = require("nodemailer");

router.post("/pay", async (req, res) => {
    let { element, item } = req.body;
    try {
        if (element === "Approve") {
            // adding course to user db
            const user = await userModel.findOneAndUpdate({ _id: item.userId }, { $push: { "myLearning": [item.courseId] } });
            const newPurchase = await purchaseModel.create({
                title: item.title,
                price: item.price,
                time: item.time,
                userId: item.userId
            });
            const status = await orderModel.findOneAndDelete({ _id: item._id })
            const order = await orderModel.find();
            try {
                const template = `
                    <div style="background-color: #170F1E; color:#fff; padding: 1.5rem; border-radius: 10px;">
                        <h1 style="font-family: Gill Sans, sans-serif;
                        font-weight: 500; color: #fff;">Coursi<span style="color: orange;">.</span></h1>
                        <h2 style="font-family: Gill Sans, sans-serif;
                        font-weight: 500; color: #fff;">You Order is now confirmation.</h2>
                        <h3 style="font-family: Gill Sans, sans-serif;
                        font-weight: 400; color: #fff">Course Title: ${item.title}</h3>
                        <h3 style="font-family: Gill Sans, sans-serif;
                        font-weight: 400; color: #fff">Corse Amount: ${item.price} RS</h3>
                        <h3 style="font-family: Gill Sans, sans-serif;
                        font-weight: 400; color: #fff">Now you can access this course from MY LEARNING tab or by clicking the button below.</h3><br/><br/>
                        <a href="http://localhost:5173/mylearning" target="_blank" style="color: #fff; background-color: orange; padding: 1rem 2.5rem; text-decoration: none; border-radius: 2rem; font-size: 1rem; font-weight: 600;">Go To Portal</a>
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

                sender(item.email, template, "You Order is now confirmation.")
            } catch (error) {
                console.log(error);
            }
            return res.json({ message: "User is updated! 🟢", message: "Payment Successfull", orders: order })
        } else {
            const status = await orderModel.findOneAndDelete({ _id: item._id })
            const order = await orderModel.find();
            return res.json({ message: "Order Deleted 🟢", orders: order })
        }
    } catch (error) {
        console.log("Error: ", error);
        res.json({
            message: "Payment Failed",
            success: false
        })
    }
});


module.exports = router