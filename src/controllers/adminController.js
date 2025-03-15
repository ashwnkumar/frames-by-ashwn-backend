const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");

const { envConfig } = require("../config/envConfig");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/sendResponse");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendResponse(res, 400, "Email and password are required");
    }

    if (
      email !== envConfig.adminEmail ||
      password !== envConfig.adminPassword
    ) {
      return sendResponse(res, 401, "Invalid Credentials");
    }

    const token = jwt.sign({ role: "admin" }, envConfig.jwtSecret, {
      expiresIn: envConfig.jwtExpiration,
    });

    sendResponse(res, 200, "Login successful", { token });
  } catch (error) {
    sendResponse(res, 500, error.message);
    console.log(error);
  }
};

module.exports = {
  adminLogin,
};
