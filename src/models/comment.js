const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema(
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
        post_id: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            index: true,
        },
        parent_id: {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment", CommentSchema);