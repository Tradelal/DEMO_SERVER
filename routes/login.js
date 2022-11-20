const express = require('express');
require("../db/conn")
const {userModel} = require("../model/user.model");
const admin = require("../model/admin.model");
const bcrypt = require("bcryptjs");
const { Route } = require('react-router-dom');
const middleware = require("../middleware/auth")

const router = express.Router();

router.post("/logAdmin", async (req, res) => {  
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please Enter Required Details" })
    }

    try {

        const adminEmail = await admin.findOne({ email: email })

        if (adminEmail) {
            const isMatch = await bcrypt.compare(password, adminEmail.password);

            if (!isMatch) {
                return res.status(404).json({ error: "Invalid Credentials" });
            } else {
                const token = await adminEmail.generateAuthToken();
                console.log(token);
                return res.status(200).json({ message: "User Login Successful", token });
            }
        } else {
            return res.status(400).json({ error: "Invalid Credentials" })
        }

    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Some error occurred ! 🔴 " });
    }
}
);

router.post("/logUser", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(422).json({ error: "Please Enter Valid Credentials" })
    } else {
        try {
            const findUser = await userModel.findOne({ email: email });

            if (findUser) {
                const isMatch = await bcrypt.compare(password, findUser.password);

                if (isMatch) {
                    const token = await findUser.generateAuthToken();

                    res.status(200).json({ message: "Login Successful", token, userData: findUser });
                } else {
                    res.status(404).json({ error: "Invalid Password" });
                }
            } else {
                res.status(404).json({ error: "Invalid Username" });
            }
        } catch (err) {
            console.log(err);
            return res.status(401).json({ error: "Some error occurred ! 🔴 " });

        }
    }

})

module.exports = router;