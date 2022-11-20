const express = require("express");
const courseModel = require("../model/course.model");
const router = express.Router();

router.post("/addCourse", async (req, res) => {
  const { title, price, discount, dprice, description, courseImage, videos } = req.body;
  try {
    if (!courseImage || !title || !description || !price || !videos) {
      res
        .status(422)
        .json({ message: "Please fill out all the details! 🔴 " });
    }
    const course = await courseModel.findOne({ title });
    if (course) {
      return res.status(409).json({ message: "A similar course exists! 🔴 " });
    }
    const newCourse = await courseModel.create({
      title,
      price,
      discount,
      dprice,
      description,
      courseImage,
      videos
    });
    if (!newCourse) {
      res.json({
        message: "Some error occurred while adding a new course! 🔴 ",
      });
    }
    res.status(201).json({ message: "course added! 🟢" });
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Some error occurred while adding courses! 🔴 " });
  }
});




module.exports = router