const express = require('express');
const router = express.Router();
const meetingModel = require("../model/meeting.model");

router.post('/deleteMeeting', async (req, res) => {
    const { id } = req.body;

    try {
        const status = await meetingModel.findOneAndDelete({_id: id})
        res.status(200).json({ message: "Meeting deleted! 🟢" });
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching blogs! 🔴" });
    }
})

module.exports = router