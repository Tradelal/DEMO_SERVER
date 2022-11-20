const mongoose = require("mongoose");

const meetingScheme = new mongoose.Schema({
  meetingTitle: {
    required: true,
    type: String,
  },
  dateAndTimeSelecter: {
    type: String,
    required: true,
  },
  courseT: {
    type: String,
    required: true
  },
  courseId: {
    type: String,
    required: true
  },
  meetingLink: {
    type: String,
    required: true
  },
  emailStatus: {
    type: Boolean,
    required: false
  }
});

const meetingModel = new mongoose.model("MEETING", meetingScheme);

module.exports = meetingModel;