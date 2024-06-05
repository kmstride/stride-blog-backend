const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: ["http://localhost:5173"]
}));
app.use(express.json());

const port = process.env.PORT || 4000;

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g1juc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`;

//routes
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/blog", require("./routes/blogRoute"));

app.get("/", (req, res) => {
  res.send("Server Is Running Successfully");
});

app.listen(port, async () => {
  console.log(`Server is running at port: ${port}`);
  try {
    await mongoose.connect(mongoUri);
    console.log("database connected");
  } catch (error) {
    console.log("mongodb connection error!",error);
  }
});
