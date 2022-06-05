const jwt = require("jsonwebtoken");
require("dotenv/config");

const requireSignin = (req, res, next) => {
  const token = req.get("Authorization")?.split(" ")[1];
  if (token) {
    jwt.verify(
      token,
      process.env.JWT_SECRET_TOKEN_SECRET,
      { algorithms: ["HS256"] },
      async (error, decoded) => {
        if (error) {
          return res.status(404).json({
            statusCode: 2,
            message: error.message,
          });
        } else {
          const user = decoded;
          req.user = user;
          next();
        }
      }
    );
  } else {
    return res.status(401).json({
      statusCode: 0,
      message: "You are not logged in",
    });
  }
};

const userMiddleware = (req, res, next) => {
  if (req.user.role !== "user") {
    return res
      .status(400)
      .json({ statusCode: 0, message: "User access denied" });
  }
  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "super-admin" ) {
    if (req.user.role !== "admin") {
      return res
        .status(400)
        .json({ statusCode: 0, message: "Admin access denied" });
    }
  }
  next();
};

const superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "super-admin") {
    return res
      .status(200)
      .json({ statusCode: 0, message: "Super Admin access denied" });
  }
  next();
};

module.exports = {
  requireSignin,
  userMiddleware,
  adminMiddleware,
  superAdminMiddleware,
};
