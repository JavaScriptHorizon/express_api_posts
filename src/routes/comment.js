const exp = require("express");
const router = exp.Router();
const Comment = require("../models/comment");
const { authorized } = require("../services/auth");


router.get("/", async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // 1.
        const comments = await Comment.find()
            .populate("user_id")
            .skip(skip)
            .limit(limit);

        // 2.
        const totalComments = await Comment.countDocuments();

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalComments,
            totalPages: Math.ceil(totalComments / limit),
            comments,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});


router.get("/:id", async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1.
        const comment = await Comment.findById(id).populate("user_id");

        return res.status(201).json({
            comment,
            success: true
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
})


router.post("/create", authorized, async (req, res, next) => {
    try {
        const { title, content } = req.body;
        const user_id = req.user_id;

        // 1.
        if (!title || !content || !user_id) return res.status(400).json({
            message: "Invalid data",
            success: false
        });

        // 2.
        const newComment = await Comment.create({ title, content, user_id, ...req.body });

        return res.status(201).json({
            comment: newComment,
            success: true
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});


router.put("/updata/:id", authorized, async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user_id;

        // 1.
        if (!user_id) return res.status(400).json({
            message: "Invalid data",
            success: false
        });

        // 2.
        const updComment = await Comment.findOneAndUpdate({ _id: id, user_id }, req.body).populate("user_id");;

        return res.status(201).json({
            comment: newComment,
            success: true
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});


router.delete("/delete/:id", authorized, async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user_id;

        // 1.
        if (!id || !user_id) return res.status(400).json({
            message: "Invalid data",
            success: false
        });

        // 2.
        const delComment = await Comment.findOneAndDelete({ _id: id, user_id }).populate("user_id");

        return res.status(200).json({
            comment: delComment,
            success: true
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});





module.exports = router;