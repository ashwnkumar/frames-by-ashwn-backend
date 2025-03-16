const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  loginAdmin,
  getAdminDetails,
  updateAdmin,
  updateAdminPassword,
  registerAdmin,
} = require("../controllers/adminController");
const upload = require("../config/multerConfig");
const adminRouter = express.Router();

// Routes
adminRouter.post("/login", loginAdmin);
adminRouter.post("/register", registerAdmin);
adminRouter.get("/", getAdminDetails);
adminRouter.put(
  "/",
  authMiddleware,
  upload.fields([{ name: "profileUrl" }, { name: "landingPageUrl" }]),
  updateAdmin
);
adminRouter.put("/change-password", authMiddleware, updateAdminPassword);

module.exports = adminRouter;
