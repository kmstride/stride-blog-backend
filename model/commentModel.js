const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: String,
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }
},{
    timestamps: true
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;