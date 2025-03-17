const { sendResponse } = require("../utils/sendResponse");
const Admin = require("../models/adminModel");
const nodemailer = require("nodemailer");
const { envConfig } = require("../config/envConfig");

const sendEmail = async (req, res) => {
  try {
    const { senderName, senderMail, subject, message } = req.body;
    console.log("senderName from api call", senderName);
    console.log("senderMail from api call", senderMail);
    console.log("subject from api call", subject);
    console.log("message from api call", message);

    if (!senderName || !senderMail || !subject || !message) {
      return sendResponse(res, 400, "All fields are required");
    }

    console.log("req.body from api call", req.body);

    const admin = await Admin.findOne();
    if (!admin) {
      return sendResponse(res, 404, "Admin not found");
    }

    const transporter = nodemailer.createTransport({
      service: envConfig.smtpService,
      host: envConfig.smtpHost,
      port: 587,
      secure: false,
      auth: {
        user: admin.email,
        pass: envConfig.googleAppPassword,
      },
    });

    const mailOptions = {
      from: senderMail,
      to: admin.email,
      subject: `New inquiry: ${subject}`,
      text: `Message: ${message}\n\n Sent By: ${senderName}\nEmail: ${senderMail}`,
    };

    await transporter.sendMail(mailOptions);

    sendResponse(res, 200, "Email sent successfully");
  } catch (error) {
    console.log("Error sending email", error);
    sendResponse(res, 500, "Server error", { error });
  }
};

module.exports = { sendEmail };
