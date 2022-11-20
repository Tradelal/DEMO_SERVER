const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  courseId: {
    required: true,
    type: String,
  },
  title: {
    required: true,
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  transactionid: {
    type: String,
    required: false
  },
  img: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  }
});

const oderModel = new mongoose.model("ORDER", orderSchema);

module.exports = oderModel;