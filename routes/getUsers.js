const express = require('express');
const router = express.Router();
const {userModel} = require("../model/user.model");

router.get('/getUsers', async (req, res) => {
    const { userId } = req.body;

    try {
        const findUser = await userModel.find();
        return res.json({message: "User detail is sent! 🟢", user: findUser})
    } catch (error) {
        return res
        .status(401)
        .json({ message: "Some error occurred while fetching user! 🔴" });
    }
})

module.exports = router