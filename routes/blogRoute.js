const {
  createPost,
  getAllPost,
  updatePost,
  deletePost,
  singlePostById,
  postsByUser,
  countPostByUser,
  searchPost,
  countPosts,
  authorPerformance,
} = require("../controllers/blogController");
const verifyToken = require("../lib/verifyToken");

const router = require("express").Router();

router.post("/create", verifyToken, createPost);
router.get("/all", getAllPost);
router.get("/myPosts", verifyToken, postsByUser);
router.get("/count", countPosts);
router.get("/myPostsCount", verifyToken, countPostByUser)
router.route("/:id").get(singlePostById);
router.route("/:id", verifyToken).put(updatePost).delete(deletePost);
router.post("/search", searchPost);
router.get("/authorPerformance", verifyToken, authorPerformance)

module.exports = router;
