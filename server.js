require("dotenv").config();
const express = require("express");
const dbConnection = require("./config/dbConfig");
const authRoutes = require('./routes/auth')
const otpRoutes = require('./routes/otp')

const app = express();
app.use(express.json())


app.use("/api/v1/auth",authRoutes)
app.use('/otp',otpRoutes)
app.get("/health", (req, res, next) => {
  try {
    res.json({
      message: "server running....",
    });
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, async () => {
  console.log(`Server runnning at http://${host}:${port}`);
  await dbConnection.mongoDbConnection();
});
