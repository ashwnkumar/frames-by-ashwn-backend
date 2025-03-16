const { sendResponse } = require("../utils/sendResponse");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendResponse(
      res,
      401,
      "Unauthorized: Authorization header not found"
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return sendResponse(res, 401, "Unauthorized: Token not found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return sendResponse(res, 401, "Unauthorized: Admin not found");
    }

    req.user = admin; // Attach admin details to request object
    next();
  } catch (error) {
    console.log(error);
    return sendResponse(res, 401, "Unauthorized: Invalid token");
  }
};

module.exports = { authMiddleware };
