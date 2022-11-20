const express = require('express');
const router = express.Router();
const purchaseModel = require("../model/purchase.model");

router.get('/getSales', async (req, res) => {
    try {
        const sales = await purchaseModel.find();
        return res.json({message: "All sales are sent! 🟢", sales: sales})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching sales! 🔴" });
    }
})

module.exports = router