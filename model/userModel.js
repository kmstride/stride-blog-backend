const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        trim: true,
        unique: true
    },
    password: String,
    photo: String,
    using: {
        type: String,
        default: "manual"
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;