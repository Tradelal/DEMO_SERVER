const express = require('express');
const router = express.Router();
const blogModel = require('../model/blog.model');

router.post('/deleteBlog', async (req, res) => {
    const { title } = req.body;

    try {
        const status = await blogModel.findOneAndDelete({title: title})
        return res.json({ message: "Blog Deleted 🟢", status: status })
    } catch (error) {
        return res
            .status(401)
            .json({ message: "Some error occurred while fetching blogs! 🔴" });
    }
})
    
module.exports = router