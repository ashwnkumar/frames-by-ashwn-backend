const envConfig = {
  port: String(process.env.PORT || 4000),
  mongoUrl: String(process.env.MONGODB_URL),
  jwtSecret: String(process.env.JWT_SECRET),
  cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME),
  cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY),
  cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
};

module.exports = { envConfig };
