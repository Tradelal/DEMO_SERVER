const express = require("express");
const meetingModel = require("../model/meeting.model");
const router = express.Router();
const { userModel } = require("../model/user.model");
const mailer = require("nodemailer");
var moment = require('moment');

router.post("/addNewMeeting", async (req, res) => {
    const { meetingTitle, dateAndTimeSelecter, courseTitle, meetingLink } = req.body;
    const courseData = JSON.parse(courseTitle);
    const courseT = courseData.title
    const courseId = courseData.id
    let findUser

    try {
        const meeting = await meetingModel.findOne({ meetingTitle });
        if (meeting) {
            return res.status(409).json({ message: "A similar meeting exists! 🔴 " });
        }
        const newMeeting = await meetingModel.create({
            meetingTitle,
            dateAndTimeSelecter,
            courseT,
            courseId,
            meetingLink,
            emailStatus: false
        });
        if (!newMeeting) {
            res.json({
                message: "Some error occurred while adding a new meeting! 🔴 ",
            });
        }
        res.status(200).json({ message: "Meeting added! 🟢" });
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while adding meeting! 🔴 " });
    }

    // find users email address
    try {
        findUser = await userModel.find({ myLearning: courseId });
    } catch (error) {
        console.log(error);
    }

    // send email code

    try {
        const template = `
            <div style="background-color: #170F1E; color:#fff; padding: 1.5rem; border-radius: 10px;">
            <h1 style="font-family: Gill Sans, sans-serif;
            font-weight: 500; color: #fff;">Coursi<span style="color: orange;">.</span></h1>
            <h2 style="font-family: Gill Sans, sans-serif;
            font-weight: 500; color: #fff;">New Meeting is scheduled!!!</h2>
            <h3 style="font-family: Gill Sans, sans-serif;
            font-weight: 400; color: #fff; width: 85%;">Course Title: ${courseT}</h3>
            <h3 style="font-family: Gill Sans, sans-serif;
            font-weight: 400; color: #fff; width: 85%;">Meeting Title: ${meetingTitle}</h3>
            <h3 style="font-family: Gill Sans, sans-serif;
            font-weight: 400; color: #fff">${moment(dateAndTimeSelecter).format('llll')}</h3><br/>

            <a href=${meetingLink} target="_blank" style="color: #fff; background-color: orange; padding: 1rem 2.5rem; text-decoration: none; border-radius: 2rem; font-size: 1rem; font-weight: 600;">Join Now</a>
            <br/><br/><br/>
            Regards,<br/>
            Team Coursi 2022
            </h3>
            </div>
        `

        const sender = (element, template) => {
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
                subject: "New Meeting Scheduled For Coursi",
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

        var i = 0;
        var intervalId = null;

        var varName = function () {
            if (i < findUser.length) {
                var element = findUser[i].email
                sender(element, template)
                i++;
            } else {
                clearInterval(intervalId);
                console.log("Email Send To All Users....");
            }
        };

        intervalId = setInterval(varName, 1000);

        const meeting = await meetingModel.findOneAndUpdate({ meetingTitle: meetingTitle }, { emailStatus: true }, {
            new: true
        });

    } catch (error) {
        console.log(error);
    }
});


module.exports = router