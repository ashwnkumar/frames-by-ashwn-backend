const express = require("express");
const { adminLogin } = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);

module.exports = adminRouter;
