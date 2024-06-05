const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authToken = req.headers.authorization.split(" ")[1];
  jwt.verify(authToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({
        message: "Forbidden Access",
      });
    } else {
      req.user = decoded;
      next();
    }
  });
};
