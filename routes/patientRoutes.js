const express = require("express");
const Patient = require("../models/patient");
const router = express.Router();
const twilio = require("twilio");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "JSK_LUXE";

// ✅ LOGIN - Generate JWT Token
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials
    if (username === "administrator@luxehh.com" && password === "Luxehh2025") {
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "2h" });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// ✅ Create Patient
router.post("/add", async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Get All Patients
router.get("/", async (req, res) => {
    try {
        const patients = await Patient.find();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Get Single Patient
router.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Update Patient
router.put("/:id", async (req, res) => {
    try {
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPatient);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// ✅ Delete Patient
router.delete("/:id", async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ✅ Twilio Webhook to receive incoming SMS and respond
router.post("/reply", async (req, res) => {
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const twiml = new MessagingResponse();

    const userMessage = req.body.Body?.toLowerCase().trim();
    const fromNumber = req.body.From;

    console.log(`Received message from ${fromNumber}: ${userMessage}`);

    const responses = {
        yes: "Thanks for confirming! Stay on track. ✅",
        no: "Thanks for letting us know. We’re here to help!",
        help: "Please call your healthcare provider if you're not feeling well."
    };

    const reply = responses[userMessage] || "Thank you for your message. We'll review it soon!";

    twiml.message(reply);

    res.set("Content-Type", "text/xml");
    res.send(twiml.toString());
});

module.exports = router;
