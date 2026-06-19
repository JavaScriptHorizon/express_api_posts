const exp = require("express");
const router = exp.Router();
const bcrypt = require("bcryptjs")
const User = require("../models/user");
const { generateToken } = require("../services/auth");
const salt = 10;



router.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body

        // 1.
        if (!email || !password) return res.status(401).json({
            message: "Email or Password are not validation.",
            success: false,
        });

        // 2.
        const existUser = await User.findOne({
            email,
        });

        if (!existUser) return res.status(404).json({
            message: "User is not exist.",
            success: false,
        });

        // 3.
        const comparePassword = await bcrypt.compare(password, existUser.password);
        if (!comparePassword) return res.status(400).json({
            message: "Password is not right",
            success: false,
        });

        // 4.
        const token = generateToken({
            user_id: existUser._id,
            createdAt: Date.now()
        });

        return res.status(200).json({
            user: existUser,
            token,
            success: true,
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
});


router.post("/register", async (req, res, next) => {
    try {
        const { name, email, password, username } = req.body

        // 1.
        if (!email || !password || !name || !username) return res.status(401).json({
            message: "Name ,Email or Password are not validation.",
            success: false,
        });

        // 2.
        const existUser = await User.findOne({
            email,
        });

        if (existUser) return res.status(404).json({
            message: "User is exist.",
            success: false,
        });

        // 3.
        const hashPassword = await bcrypt.hash(password, salt);

        // 4.
        const newUser = (await User.create({
            name,
            email,
            password: hashPassword,
            username
        }));

        // 5.
        const token = generateToken({
            user_id: newUser._id,
            createdAt: Date.now()
        });

        return res.status(201).json({
            user: newUser,
            token,
            success: true,
        });

    }
    catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;