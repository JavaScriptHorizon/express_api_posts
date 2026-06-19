const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        index: true,
        required: true,
        set: v => v.startsWith("@") ? v : `@${v}`
    },
    avatar: String,
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"]
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        defalut: "USER",
        index: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("User", UserSchema);