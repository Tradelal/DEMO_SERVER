const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type: String,
        required: true,
        minlength: 6
    }
});

// Hashing our Password
adminSchema.pre("save", async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 12)
    }
    next();
})

adminSchema.methods.generateAuthToken = async function () {
    try {
        const admintoken = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);

        // this.admintokens = this.admintokens.concat({ admintoken: admintoken });
        // await this.save();
        return admintoken;
    } catch (e) {
        console.log(e);
    }
}

const adminModel = new mongoose.model("ADMIN", adminSchema);

module.exports = adminModel;