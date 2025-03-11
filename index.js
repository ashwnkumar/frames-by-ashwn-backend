const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { connectDb } = require("./src/config/mongodb"); // Updated import statement
const { envConfig } = require("./src/config/envConfig");
const cors = require("cors");
const photoRoutes = require("./src/routes/photoRoutes"); // Import photoRoutes

connectDb();

const app = express();
const port = envConfig.port;

app.use(cors());
app.use(express.json());

app.use("/api/photos", photoRoutes); // Use photoRoutes for /api/photos path

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
