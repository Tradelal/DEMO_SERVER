const express = require('express');
const router = express.Router();
const purchaseModel = require("../model/purchase.model");

router.get('/getPurchase', async (req, res) => {
    try {
        const purchase = await purchaseModel.find();
        return res.json({message: "All purchase history are send! 🟢", history: purchase})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching purchase history! 🔴" });
    }
})

module.exports = router