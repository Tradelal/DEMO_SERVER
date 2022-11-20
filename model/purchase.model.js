const mongoose = require("mongoose");

const purchaseScheme = new mongoose.Schema({
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
  }
});

const purchaseModel = new mongoose.model("PURCHASE", purchaseScheme);

module.exports = purchaseModel;