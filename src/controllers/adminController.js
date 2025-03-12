const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");

const { envConfig } = require("../config/envConfig");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../utils/sendResponse");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("envConfig.adminPassword", envConfig.adminPassword);
    console.log("password", password);
    if (!email || !password) {
      return sendResponse(res, 400, "Email and password are required");
    }

    if (email !== envConfig.adminEmail) {
      return sendResponse(res, 401, "Invalid email ");
    }

    const validPassword = await bcrypt.compare(
      password,
      envConfig.adminPassword
    );

    if (!validPassword) {
      return sendResponse(res, 401, "Invalid password");
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
