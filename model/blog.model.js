// image: S
// title: S
// desc: S
// tags [] len: upto 4
// like: Num

const mongoose = require("mongoose");
const userModel = require("./user.model");

const blogSchema = new mongoose.Schema({
  image: String,
  slug: {
    type: String,
    required: true
  },
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  tags: [
    {
      type: String,
    },
  ],
});

const blogModel = new mongoose.model("BLOGS", blogSchema);

module.exports = blogModel;
