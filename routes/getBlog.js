const express = require('express');
const router = express.Router();
const blogModel = require("../model/blog.model");

router.post('/getBlog', async (req, res) => {
    try {
        const blog = await blogModel.findOne({slug: `${req.body.slug}`});
        return res.json({message: "A blog is sent! 🟢", blog: blog})
    } catch (error) {
        return res
        .status(500)
        .json({ message: "Some error occurred while fetching blogs! 🔴" });
    }
})

module.exports = router