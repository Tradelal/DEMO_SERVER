const express = require('express');
const router = express.Router();
const blogModel = require("../model/blog.model");

router.get('/getBlogs', async (req, res) => {
    try {
        const blogs = await blogModel.find();
        return res.json({message: "All blogs are sent! 🟢", blogs: blogs})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching blogs! 🔴" });
    }
})

module.exports = router