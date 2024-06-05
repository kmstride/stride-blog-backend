const Post = require("../model/postModel");
const mongoose = require("mongoose");

module.exports = {
  createPost: async (req, res) => {
    const id = req.user.id;
    const post = await Post.create({ ...req.body, author: id });
    res.status(201).json({ message: "Post Created Successfully", post });
  },
  getAllPost: async (req, res) => {
    const { page, size } = req.query;
    let posts;
    if (page || size) {
      posts = await Post.find({})
        .sort({ _id: -1 })
        .limit(parseInt(size))
        .skip(parseInt(size) * parseInt(page))
        .populate("author");
    } else {
      posts = await Post.find({}).sort({ _id: -1 }).populate("author");
    }

    res.status(200).json(posts);
  },
  postsByUser: async (req, res) => {
    const { page, size } = req.query;
    const id = req.user.id;
    let posts;
    if (page || size) {
      posts = await Post.find({ author: new mongoose.Types.ObjectId(id) })
        .sort({ _id: -1 })
        .limit(parseInt(size))
        .skip(parseInt(size) * parseInt(page));
    } else {
      posts = await Post.find({ author: new mongoose.Types.ObjectId(id) }).sort(
        { _id: -1 }
      );
    }
    res.status(200).json(posts);
  },
  countPosts: async (req, res) => {
    const count = await Post.countDocuments();
    res.status(200).json({ count });
  },
  countPostByUser: async (req, res) => {
    const id = req.user.id;
    const count = await Post.countDocuments({
      author: new mongoose.Types.ObjectId(id),
    });
    res.status(200).json({ count });
  },
  singlePostById: async (req, res) => {
    try {
      const id = req.params.id;
      const post = await Post.findById(id).populate("author");
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Post Not Found!" });
    }
  },
  searchPost: async (req, res) => {
    try {
      const words = req.body.data.split(" ");
      const regexArray = words.map((word) => new RegExp(word, "i")); // 'i' for case-insensitive

      const conditions = regexArray.map((regex) => ({
        $or: [{ title: regex }, { description: regex }],
      }));
      const results = await Post.find({ $and: conditions });
      console.log(results);
      res.status(200).json(results);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Post Not Found!" });
    }
  },
  updatePost: async (req, res) => {
    try {
      const id = req.params.id;
      await Post.findByIdAndUpdate(
        id,
        {
          $set: { ...req.body },
        },
        { new: true }
      );
      res.status(204).json({ message: "Post Updated Successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Post Not Found!" });
    }
  },
  deletePost: async (req, res) => {
    try {
      const id = req.param.id;
      const deleted = await Post.findOneAndDelete(id);
      console.log(deleted);
      res.status(200).json({ message: "Post Deleted Successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Internal Server Error!" });
    }
  },
  authorPerformance: async (req, res) => {
    try {
      const authorPerformance = await Post.aggregate([
        {
          $group: {
            _id: "$author",
            postCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "author",
          },
        },
        {
          $unwind: "$author",
        },
        {
          $project: {
            _id: 0,
            authorName: "$author.name",
            postCount: 1,
          },
        },
      ]);
      console.log(authorPerformance)
      res.json(authorPerformance);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
};
