const express = require("express");
const cors = require("cors"); // 👈 Import CORS
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
require("dotenv").config();

const app = express();

// 👇 Enable CORS for all origins (can restrict later if needed)
app.use(cors());

// Body parser
app.use(express.json());

// Routes
app.use("/api/patients", patientRoutes);

// Connect to MongoDB
connectDB();

// Start Cron Job
require("./cron/updateHiddenFlag");

module.exports = app;
