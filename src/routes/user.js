const exp = require("express");
const router = exp.Router();
const User = require("../models/user");




router.get("/", async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;
    
        // 1.
        const users = await User.find()
            .skip(skip)
            .limit(limit);
    
        // 2.
        const totalUsers = await User.countDocuments();
    
        return res.status(200).json({
            success: true,
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


module.exports = router;