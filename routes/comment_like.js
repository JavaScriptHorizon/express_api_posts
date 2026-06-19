const exp = require("express");
const router = exp.Router();
const CommentLike = require("../models/comment_like");
const { authorized } = require("../services/auth");


router.get("/", async (req, res, next) => {
    try {
        const limit = Number(req.query.limit) || 8;
        const page = Number(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // 1.
        const commentLikes = await CommentLike.find()
            .populate("user_id")
            .skip(skip)
            .limit(limit);

        // 2.
        const totalCommentLikes = await CommentLike.countDocuments();

        return res.status(200).json({
            success: true,
            page,
            limit,
            totalCommentLikes,
            totalPages: Math.ceil(totalCommentLikes / limit),
            commentLikes,
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
        const commentLike = await CommentLike.findById(id).populate("user_id");

        return res.status(201).json({
            commentLike,
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
        const { content, reaction } = req.body;
        const user_id = req.user_id;

        // 1.
        if (!reaction || !content || !user_id) return res.status(400).json({
            message: "Invalid data",
            success: false
        });

        // 2.
        const newCommentLike = await CommentLike.create({ reaction, content, user_id });

        return res.status(201).json({
            commentLike: newCommentLike,
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
        const { reaction, content } = req.body;
        const { id } = req.params;
        const user_id = req.user_id;

        // 1.
        if (!user_id || (!reaction || !content)) return res.status(400).json({
            message: "Invalid data",
            success: false
        });

        // 2.
        const updCommentLike = await CommentLike.findOneAndUpdate({ comment_id: id, user_id }, req.body).populate("user_id");;

        return res.status(201).json({
            commentLike: updCommentLike,
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
        const delCommentLike = await CommentLike.findOneAndDelete({ comment_id: id, user_id }).populate("user_id");

        return res.status(200).json({
            commentLike: delCommentLike,
            success: true
        });
    }
    catch (err) {
        console.error(err);
        next(err);
    }
});





module.exports = router;