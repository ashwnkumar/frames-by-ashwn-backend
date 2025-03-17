const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const { connectDb } = require("./src/config/mongodb"); // Updated import statement
const { envConfig } = require("./src/config/envConfig");
const cors = require("cors");

const adminRouter = require("./src/routes/adminRouter");
const photoRouter = require("./src/routes/photoRouter");
const nodemailerRouter = require("./src/routes/nodemailerRouter");

connectDb();

const app = express();
const port = envConfig.port;

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminRouter);
app.use("/api/photos", photoRouter);
app.use("/api/send-email", nodemailerRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
