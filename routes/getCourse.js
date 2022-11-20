const express = require('express');
const router = express.Router();
const courseModel = require("../model/course.model");

router.get('/getCourse', async (req, res) => {
    try {
        const courses = await courseModel.find();
        return res.json({message: "All courses are sent! 🟢", course: courses})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching blogs! 🔴" });
    }
})

module.exports = router