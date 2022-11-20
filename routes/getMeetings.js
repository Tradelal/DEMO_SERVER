const express = require('express');
const router = express.Router();
const meetingModel = require("../model/meeting.model");

router.get('/getMeetings', async (req, res) => {
    try {
        const meetings = await meetingModel.find();
        return res.json({message: "All meetings are sent! 🟢", meetings: meetings})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching meetings! 🔴" });
    }
})

module.exports = router