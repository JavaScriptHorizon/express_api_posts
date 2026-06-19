const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentReportSchema = new Schema(
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
        reason: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: [
                "pending",
                "under_review",
                "resolved",
                "dismissed",
                "removed",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Comment_report", CommentReportSchema);