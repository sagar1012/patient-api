const express = require("express");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use("/api/patients", patientRoutes);

connectDB();
require("./cron/updateHiddenFlag"); // Start Cron Job

module.exports = app;
