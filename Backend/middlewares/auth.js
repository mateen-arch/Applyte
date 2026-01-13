require("dotenv").config();
const jwt = require("jsonwebtoken");

const isAuthorized = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Token is not available!",
        success: false,
      });
    }

    const decode_token = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode_token) {
      return res.status(401).json({
        message: "User is not authorized!",
        success: false,
      });
    }

    req._id = decode_token.id;
    next();
  } catch (e) {
    console.log("Error in Auth middleware: ", e);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

module.exports = { isAuthorized };
