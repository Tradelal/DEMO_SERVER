const express = require('express');
const router = express.Router();
const courseModel = require("../model/course.model");

router.post('/getCourseById', async (req, res) => {
    const { id } = req.body;
    
    try {
        const courses = await courseModel.findOne({_id: id});
        return res.json({message: "Courses is sent! 🟢", course: courses})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching course! 🔴" });
    }
})

module.exports = router