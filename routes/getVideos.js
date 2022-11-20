const express = require('express');
const router = express.Router();
const videoModel = require("../model/video.model");

router.get('/getVideos', async (req, res) => {
    try {
        const videos = await videoModel.find();
        return res.json({message: "All videos are sent! 🟢", video: videos})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching video! 🔴" });
    }
})

module.exports = router