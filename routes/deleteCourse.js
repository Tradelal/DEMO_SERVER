const express = require('express');
const router = express.Router();
const courseModel = require("../model/course.model");

router.post('/deleteCourse', async (req, res) => {
    const { id } = req.body;

    try {
        const status = await courseModel.findOneAndDelete({_id: id})
        return res.json({ message: "Course Deleted 🟢", status: status })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching blogs! 🔴" });
    }
})

module.exports = router