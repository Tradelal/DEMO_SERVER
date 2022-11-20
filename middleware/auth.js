const jwt = require("jsonwebtoken");
const login = require("../model/user.model");

const middleware = async (req, res, next)=>{
    try {
        
        const token = req.header['Authorization'];
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = middleware;