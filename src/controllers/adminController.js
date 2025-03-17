const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const { sendResponse } = require("../utils/sendResponse");
const { cloudinary } = require("../config/cloudinary");
require("dotenv").config();

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin already exists
    const admin = await Admin.findOne({ email });
    if (admin) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    sendResponse(res, 201, "Admin registered successfully");
  } catch (error) {
    console.error("Error registering admin", error);
    sendResponse(res, 500, "Server error", error.message);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      sendResponse(res, 404, "Admin not found");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      sendResponse(res, 401, "Incorrect password");
    }

    // Generate JWT
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    sendResponse(res, 200, "Admin logged in successfully", { token });
  } catch (error) {
    sendResponse(res, 500, "Server error", error.message);
  }
};

const getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("-password");

    if (!admin) {
      return sendResponse(res, 404, "Admin not found"); // Added return to stop execution
    }

    sendResponse(res, 200, "Admin details fetched successfully", { admin });
  } catch (error) {
    console.error("Error fetching admin details", error);
    sendResponse(res, 500, "Server error", error.message);
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { name, email, aboutText } = req.body;

    const admin = await Admin.findById(req.user.id);
    if (!admin) return sendResponse(res, 400, "Admin does not exist");

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.aboutText = aboutText || admin.aboutText;

 

    // Function to extract public ID from Cloudinary URL
    const getPublicId = (url) => {
      if (!url) return null;
      const parts = url.split("/");
      return parts[parts.length - 1].split(".")[0]; // Extract ID from URL
    };

    if (req.files?.profileUrl) {
      try {
        // Delete existing profileUrl from Cloudinary if present
        if (admin.profileUrl) {
          const publicId = getPublicId(admin.profileUrl);
          if (publicId)
            await cloudinary.uploader.destroy(
              `frames-by-ashwn/admin/${publicId}`
            );
        }

        // Upload new profile image
        const response = await cloudinary.uploader.upload(
          req.files.profileUrl[0].path,
          {
            folder: "frames-by-ashwn/admin",
            use_filename: true,
          }
        );

        admin.profileUrl = response.secure_url;
      } catch (error) {
        return sendResponse(
          res,
          500,
          "Error uploading profile image",
          error.message
        );
      }
    }

    if (req.files?.landingPageUrl) {
      try {
        // Delete existing landingPageUrl from Cloudinary if present
        if (admin.landingPageUrl) {
          const publicId = getPublicId(admin.landingPageUrl);
          if (publicId)
            await cloudinary.uploader.destroy(
              `frames-by-ashwn/admin/${publicId}`
            );
        }

        // Upload new landing page image
        const response = await cloudinary.uploader.upload(
          req.files.landingPageUrl[0].path,
          {
            folder: "frames-by-ashwn/admin",
            use_filename: true,
          }
        );

        admin.landingPageUrl = response.secure_url;
      } catch (error) {
        return sendResponse(
          res,
          500,
          "Error uploading landing page image",
          error.message
        );
      }
    }

    await admin.save();

    sendResponse(res, 200, "Admin updated successfully", { admin });
  } catch (error) {
    console.error("Error updating admin", error);
    sendResponse(res, 500, "Server error", error.message);
  }
};

const updateAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find admin
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      sendResponse(res, 404, "Admin not found");
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return sendResponse(res, 401, "Incorrect current password");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    admin.password = hashedPassword;
    await admin.save();

    sendResponse(res, 200, "Password updated successfully");
  } catch (error) {
    sendResponse(res, 500, "Server error", error.message);
    console.error("Server error", error);
  }
};

module.exports = {
  loginAdmin,
  registerAdmin,
  getAdminDetails,
  updateAdmin,
  updateAdminPassword,
};
