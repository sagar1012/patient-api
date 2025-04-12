const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    address: String,
    contactNo: String,
    hidden: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Patient", patientSchema);
