const envConfig = {
  port: String(process.env.PORT || 4000),
  mongoUrl: String(process.env.MONGODB_URL),
  jwtSecret: String(process.env.JWT_SECRET),
  jwtExpiration: String(process.env.JWT_EXPIRATION),
  cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME),
  cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY),
  cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
  adminEmail: String(process.env.ADMIN_EMAIL),
  adminPassword: String(process.env.ADMIN_PASSWORD),
};

module.exports = { envConfig };
