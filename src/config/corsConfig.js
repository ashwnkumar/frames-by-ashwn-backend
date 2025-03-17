const { envConfig } = require("./envConfig");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || envConfig.allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  //   allowedHeaders: "Content-Type, Authorization",
  //   exposedHeaders: "Authorization",
  credentials: true,
};

module.exports = { corsOptions };
