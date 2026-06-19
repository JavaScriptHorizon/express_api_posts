const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentLikesSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
            trim: true
        },
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        comment_id: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
        },
        reaction: {
            type: String,
            enum: ["LIKE", "HART"],
            required: true,
            index: true,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment_like", CommentLikesSchema);