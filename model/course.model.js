const mongoose = require("mongoose");
const userModel = require("./user.model");

const courseSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
    },
    price: {
        required: true,
        type: Number,
    },
    discount: {
        required: true,
        type: Number,
    },
    dprice: {
        required: true,
        type: Number,
    },
    description: {
        required: true,
        type: String,
    },
    courseImage: {
        required: true,
        type: String,
    },
    videos: [
        {
            videoTitle: {
                type: String,
            },
            videoUrl: {
                type: String,
            }
        },
    ],
});

const courseModel = new mongoose.model("COURSE", courseSchema);

module.exports = courseModel;