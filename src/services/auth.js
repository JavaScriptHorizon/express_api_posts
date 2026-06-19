const { request, response } = require("express");
const jwt = require("jsonwebtoken");

exports.generateToken = (body = {}) => {
    return jwt.sign(body, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d"
    });
};

exports.authorized = (req = request, res = response, next) => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.status(401).json({
                message: "Token required"
            });
        }

        const token = authorization.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET_KEY
        );

        req.user_id = decoded.user_id;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};