const express = require('express');
const router = express.Router();
const orderModel = require("../model/order.model");

router.get('/getOrder', async (req, res) => {
    try {
        const order = await orderModel.find();
        return res.json({message: "All order are sent! 🟢", orders: order})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching order! 🔴" });
    }
})

module.exports = router