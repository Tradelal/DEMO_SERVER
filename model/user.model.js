const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userContact = new mongoose.Schema({
    code: {
        type: String
    },
    phone: {
        type: String
    }
})

const userSchema = new mongoose.Schema({
    referedBy: String,
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    contact : [userContact],
    referal_id: {
        type: String,
        required: false
    },
    myLearning: [
        {
            type: String,
        }
    ]

});

userSchema.pre("save", async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }

    next();
})

userSchema.methods.generateAuthToken = async function () {
    try {
        const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        return token;
    } catch (e) {
        console.log(e);
    }
}

const contactModel = new mongoose.model("CONTACT", userContact)
const userModel = new mongoose.model("CUSTOMER", userSchema);

module.exports = {userModel, contactModel}