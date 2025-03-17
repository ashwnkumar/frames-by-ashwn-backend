const express = require("express");
const { sendEmail } = require("../controllers/nodemailerController");

const nodemailerRouter = express.Router();

nodemailerRouter.post("/", sendEmail);

module.exports = nodemailerRouter;
