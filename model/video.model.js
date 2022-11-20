const mongoose = require("mongoose");

const videoScheme = new mongoose.Schema({
  videoUrl: {
    required: false,
    type: String,
  },
  videoTitle: {
    required: false,
    type: String,
  },
  videoStatus: {
    type: Boolean,
    required: false
  }
});

const videoModel = new mongoose.model("VIDEO", videoScheme);

module.exports = videoModel;