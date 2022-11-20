const express = require('express');
const router = express.Router();
const meetingModel = require("../model/meeting.model");

router.post('/getMeetingById', async (req, res) => {
    const { id } = req.body;
    
    try {
        const meeting = await meetingModel.findOne({ courseId: id});
        return res.json({message: "Courses is sent! 🟢", meeting: meeting})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching meeting! 🔴" });
    }
})

module.exports = router