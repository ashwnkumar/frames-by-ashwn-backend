const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { connectDb } = require("./src/config/mongodb"); // Updated import statement
const { envConfig } = require("./src/config/envConfig");
const cors = require("cors");

const adminRouter = require("./src/routes/adminRouter");
const photoRouter = require("./src/routes/photoRouter");

connectDb();

const app = express();
const port = envConfig.port;

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRouter); // Use adminRouter for /api/admin path
app.use("/api/photos", photoRouter); // Use photoRouter for /api/photos path

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
