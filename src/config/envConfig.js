const envConfig = {
  port: String(process.env.PORT || 4000),
  mongoUrl: String(process.env.MONGODB_URL),
  jwtSecret: String(process.env.JWT_SECRET),
  jwtExpiration: String(process.env.JWT_EXPIRATION),
  cloudinaryCloudName: String(process.env.CLOUDINARY_CLOUD_NAME),
  cloudinaryApiKey: String(process.env.CLOUDINARY_API_KEY),
  cloudinaryApiSecret: String(process.env.CLOUDINARY_API_SECRET),
  nodemailerSenderEmail: String(process.env.NODEMAILER_SENDER_EMAIL),
  smtpHost: String(process.env.SMTP_HOST),
  smtpService: String(process.env.SMTP_SERVICE),
  googleAppPassword: String(process.env.GOOGLE_APP_PASSWORD),
  frontendUrl: String(process.env.FRONTEND_URL),
  allowedOrigins: String(process.env.ALLOWED_ORIGINS),
};

module.exports = { envConfig };
