const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const exists = await User.findOne({ email });
      if (!exists) {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash });
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "1d" }
        );
        res.status(201).json({
          message: "user registration successfully",
          authToken: token,
        });
      } else {
        res.status(400).json({ message: "user alredy registerd" });
      }
    } catch (error) {
      console.log("error from catch", error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User Not Found!",
        });
      }
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        return res.status(401).json({
          message: "Password is incorrect!",
        });
      }
      const jwtToken = jwt.sign(
        { id: user._id, email },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        message: "Login Successfull",
        authToken: jwtToken,
      });
    } catch (error) {
      console.log("error from login catch", error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  googleSignIn: async (req, res) => {
    try {
      const user = await User.updateOne(
        { email: req.body.email },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
            using: "auto",
          },
        },
        {
          upsert: true,
        }
      );
      const loggedInUser = await User.findOne({ email: req.body.email });
      const jwtToken = jwt.sign(
        { id: loggedInUser._id, email: req.body.email },
        process.env.JWT_SECRET
      );
      res.status(200).json({
        message: "Login Successfull",
        authToken: jwtToken,
      });
    } catch (error) {
      console.log("error from google login catch", error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        console.log("No file received");
        return res.send({
          success: false,
        });
      } else {
        const host = req.get("host");
        const filePath =
          "http://" + host + "/" + req.file.path.replace(/\\/g, "/");
        const result = await User.findByIdAndUpdate(
          req.user.id,
          {
            $set: { photo: filePath },
          },
          {
            new: true,
          }
        );
        res.status(203).json({ message: "updated successfully" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  loggedInUser: async (req, res) => {
    try {
      const id = req.user.id;
      const user = await User.findById(id).select("-password -__v");
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
  updateUser: async (req, res) => {
    const id = req.user.id;
    await User.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          photo: req.body.photo,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "updated successfully" });
  },
  changePassword: async (req, res) => {
    try {
      const id = req.user.id;
      const user = await User.findById(id);
      const compare = await bcrypt.compare(req.body.current, user.password);
      if (!compare) {
        return res.status(401).json({
          message: "Current Password is incorrect!",
        });
      }
      const hash = await bcrypt.hash(req.body.password, 10);
      await User.findByIdAndUpdate(id, {
        $set: {
          password: hash,
        },
      });
      res.status(200).json({ message: "password change successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error!" });
    }
  },
};
