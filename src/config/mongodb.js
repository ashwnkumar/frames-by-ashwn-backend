const { default: mongoose } = require("mongoose");
const { envConfig } = require("./envConfig");

const connectDb = async () => {
  try {
    await mongoose.connect(`${envConfig.mongoUrl}/frames-by-ashwn`);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};

module.exports = { connectDb };
