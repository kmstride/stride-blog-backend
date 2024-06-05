const {
  register,
  login,
  googleSignIn,
  uploadImage,
  loggedInUser,
  updateUser,
  changePassword,
} = require("../controllers/userController");
const upload = require("../lib/multerData");
const verifyToken = require("../lib/verifyToken");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.put("/googleSignIn", googleSignIn);
router.put("/upload", verifyToken, upload.single("photo"), uploadImage);
router.get("/loggedIn", verifyToken, loggedInUser);
router.put("/update", verifyToken, updateUser);
router.put("/changePassword", verifyToken, changePassword);

module.exports = router;
