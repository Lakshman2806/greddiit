const jwt = require("jsonwebtoken");
const User = require("../models/user_model");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ err: "Authentication token missing" });
  }
  // console.log(authorization)
const token = authorization.replace("Bearer ", "");

try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ err: "Requesdqwet not Authorized" });
  }
};

module.exports = requireAuth;
