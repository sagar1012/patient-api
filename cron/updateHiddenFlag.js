// scheduler.js
const cron = require("node-cron");
const Patient = require("../models/patient");
const twilio = require("twilio");
require("dotenv").config();

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const dailyMessages = {
    1: {
        morning: "Good morning! 🌞 Weigh yourself before eating and after using the bathroom. Record your weight to track any changes. Call your doctor if you gain 2-3 lbs in 24 hours or 5 lbs in a week.",
        midday: "Take your medications on time! 💊 Consistent medication management keeps your heart strong. Set a daily alarm if needed!",
        evening: "Check your Heart Failure Action Plan. ✅ Are you in the Green Zone (stable), Yellow Zone (warning signs), or Red Zone (emergency)? Know when to seek help."
    },
    2: {
        morning: "Step on the scale! 📊 Daily weighing helps identify fluid retention early. Record and monitor your weight.",
        midday: "Eat smart! 🥗 Focus on a low-sodium, heart-healthy diet today. Cut back on processed foods and drink plenty of water.",
        evening: "Zone check time! 🚦 Review your symptoms. Early action can prevent complications."
    },
    3: {
        morning: "Time to weigh yourself! ⚖ Keep an eye out for sudden changes and report any concerns to your care team.",
        midday: "Blood pressure check! 🩸 Monitor your BP today and log the readings. Consistent tracking can prevent complications.",
        evening: "Reflect on your day! 💙 Did you stay in the Green Zone? Recognizing early signs of trouble can help prevent hospital visits."
    },
    4: {
        morning: "Weigh-in time! 📉 Sudden weight gain can signal fluid buildup. Record your numbers and alert your care team if needed.",
        midday: "Medication reminder! ⏰ Consistency is key to managing heart failure effectively.",
        evening: "Check your Heart Failure Action Plan! ✅ Identifying changes early keeps you on the right track."
    },
    5: {
        morning: "Good morning! 🌞 Don't forget to weigh yourself. A sudden 2-3 lb gain may require a medication adjustment.",
        midday: "Exercise time! 🚶 Aim for 20-30 minutes of light movement today. Regular activity improves heart health.",
        evening: "End-of-day check! 📚 Review your zone and log today's weight and BP readings."
    },
    6: {
        morning: "Daily weigh-in! ⚖ Consistency helps track fluid retention. Record your numbers and notify your provider if necessary.",
        midday: "Plan a heart-healthy meal! 🍲 Choose fresh vegetables, lean protein, and avoid high-sodium foods.",
        evening: "Time to assess your zone. 🚦 Are you noticing any new symptoms? Report any changes."
    },
    7: {
        morning: "Weigh yourself today! 📉 Sudden changes in weight could signal fluid buildup. Track and report any concerns.",
        midday: "Take your meds on time! 💊 Consistent medication adherence can prevent complications.",
        evening: "Green, Yellow, or Red? ✅ Zone check keeps you ahead of the game."
    },
    8: {
        morning: "Step on the scale! 📊 Daily monitoring of your weight keeps you in control of your health.",
        midday: "Check your BP today! 🩸 High blood pressure can make your heart work harder. Log it and share with your care team.",
        evening: "Stay in the Green Zone! ✅ Recognize early signs of trouble to prevent hospital visits."
    },
    9: {
        morning: "Weigh yourself now! ⚖ Consistency keeps fluid retention in check. Don't forget to log it.",
        midday: "Hydrate smart! 💧 Limit fluids to your care team's recommendations. Too much can cause fluid buildup.",
        evening: "Review your day and check your zone! 🚦 Early intervention makes a difference."
    },
    10: {
        morning: "Weigh-in reminder! 📉 Early detection of weight gain helps avoid complications.",
        midday: "Time for light movement! 🚶 Even 20 minutes of walking can improve your heart health.",
        evening: "Log your weight and BP! ✅ Daily tracking helps your care team guide your treatment."
    },
    11: {
        morning: "Scale check! ⚖ Watch for sudden weight changes and record your numbers.",
        midday: "Stick to a heart-healthy diet today! 🥗 Limit salt and stay hydrated.",
        evening: "Zone check-in time! 🚦 Recognize symptoms early and stay proactive."
    },
    12: {
        morning: "Daily weigh-in! 📊 Log it and track your progress.",
        midday: "Medication time! ⏰ Consistent adherence prevents complications.",
        evening: "Check your action plan. ✅ Early intervention keeps you out of the hospital."
    },
    13: {
        morning: "Good morning! 🌞 Weigh yourself and log your progress.",
        midday: "Hydration check! 💧 Follow your fluid restrictions to prevent fluid buildup.",
        evening: "Zone check! 🚦 Recognize signs early to stay safe."
    },
    14: {
        morning: "Step on the scale! ⚖ Keep an eye out for sudden changes.",
        midday: "Time for a short walk! 🚶 Movement keeps your heart strong.",
        evening: "Log your weight and BP! 📚 Stay ahead by tracking daily."
    },
    15: {
        morning: "Daily weight check! ⚖ Record any changes and alert your care team if needed.",
        midday: "Considering quitting smoking? 🚭 It's one of the best things you can do for your heart health.",
        evening: "Zone assessment time! 🚦 Stay aware of your symptoms and know when to seek help."
    },
    16: {
        morning: "Morning weigh-in! 📊 Tracking helps identify fluid retention early.",
        midday: "Sodium check! 🥗 Choose fresh foods over processed to reduce salt intake.",
        evening: "Review your Heart Failure Action Plan! ✅ Know your zone and next steps."
    },
    17: {
        morning: "Step on the scale! 📉 Report any sudden weight changes to your doctor.",
        midday: "Don't miss your next appointment! 📅 Regular check-ups help manage your heart failure effectively.",
        evening: "Evening zone check! 🚦 Early recognition of symptoms prevents complications."
    },
    18: {
        morning: "Time to weigh yourself! ⚖ Consistent tracking helps your care team adjust your treatment.",
        midday: "Medication reminder! 💊 Take your heart medications exactly as prescribed.",
        evening: "End-of-day assessment! 📚 Log your weight, BP, and symptom status."
    },
    19: {
        morning: "Morning weight check! 🌞 Stay proactive by monitoring fluid changes.",
        midday: "Smoking cessation tip: 🚭 Finding a support group can double your chances of quitting successfully.",
        evening: "Check your zone status! ✅ Knowing your zone helps you take appropriate action."
    },
    20: {
        morning: "Weigh-in time! 📊 Daily monitoring helps prevent complications.",
        midday: "Low-sodium tip: 🥗 Herbs and spices are great alternatives to salt for flavoring food.",
        evening: "Zone check reminder! 🚦 Early intervention keeps you out of the hospital."
    },
    21: {
        morning: "Daily scale check! ⚖ Track and report any sudden weight changes.",
        midday: "Remember your follow-up! 📅 Regular provider visits help manage your condition effectively.",
        evening: "Review your day! 💙 Staying aware of symptoms keeps you in control."
    },
    22: {
        morning: "Good morning! 🌞 Don't forget your daily weigh-in to track fluid retention.",
        midday: "Take your medications consistently! ⏰ Set reminders if needed.",
        evening: "Zone assessment time! 🚦 Know the signs that indicate you need medical attention."
    },
    23: {
        morning: "Step on the scale! 📉 Early detection of weight gain helps prevent complications.",
        midday: "Heart-healthy meal planning! 🍲 Focus on fresh vegetables and lean proteins today.",
        evening: "You're doing great! 💙 Every step you take brings you closer to better health."
    },
    24: {
        morning: "Morning weigh-in! ⚖ Consistency in tracking helps maintain your health.",
        midday: "Time for some movement! 🚶 Regular activity strengthens your cardiovascular system.",
        evening: "Check your Heart Failure Action Plan! ✅ Stay aware of your symptoms."
    },
    25: {
        morning: "Daily weight check! 📊 Monitor for any sudden changes.",
        midday: "Blood pressure monitoring day! 🩸 Log your readings to share with your care team.",
        evening: "Zone check-in! 🚦 Early recognition helps prevent hospital visits."
    },
    26: {
        morning: "Weigh yourself today! ⚖ Record the number and watch for trends.",
        midday: "Medication adherence matters! 💊 Consistency improves outcomes.",
        evening: "Stay consistent—your heart thanks you! ❤️ Keep monitoring your symptoms."
    },
    27: {
        morning: "Step on the scale! 📉 Track your weight to monitor fluid status.",
        midday: "Sodium awareness day! 🥗 Check food labels for hidden salt.",
        evening: "Review your zone status! ✅ Knowing when to seek help saves lives."
    },
    28: {
        morning: "Morning weight check! 🌞 Reporting changes helps your care team adjust treatment.",
        midday: "Get moving today! 🚶 Even small amounts of exercise benefit your heart.",
        evening: "Log your daily stats! 📚 Tracking helps identify patterns and prevent complications."
    },
    29: {
        morning: "Daily weigh-in reminder! ⚖ Consistency is key to successful management.",
        midday: "Hydration check! 💧 Follow your recommended fluid limits to prevent overload.",
        evening: "You're making great progress! 💙 Your daily efforts improve your heart health."
    },
    30: {
        morning: "Final weigh-in of the month! 📊 Keep up the good work tracking your weight.",
        midday: "Medication check! ⏰ Consistent adherence prevents complications.",
        evening: "Congratulations on completing 30 days of heart failure management! 🎉 Keep tracking your weight, BP, and symptoms to stay on top of your health. Consistency is key!"
    }
};

const getDayNumber = (createdAt) => {
    const start = new Date(createdAt);
    const now = new Date();
    const diffTime = now - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(diffDays, 30);
};

const sendScheduledMessage = async (timeOfDay) => {
    console.log(`Running task for ${timeOfDay} reminders...`);
    const patients = await Patient.find();

    for (const patient of patients) {
        const dayNum = getDayNumber(patient.createdAt);
        const message = dailyMessages[dayNum]?.[timeOfDay];

        if (!message) continue;

        try {
            await client.messages.create({
                body: message.replace("${patient.name}", patient.name),
                from: process.env.TWILIO_PHONE_NUMBER,
                to: patient.contactNo
            });
            console.log(`Message sent to ${patient.contactNo}`);
        } catch (err) {
            console.error(`Failed to send message to ${patient.contactNo}: ${err.message}`);
        }
    }
};

cron.schedule("0 7 * * *", () => sendScheduledMessage("morning"));
cron.schedule("0 13 * * *", () => sendScheduledMessage("midday"));
cron.schedule("30 18 * * *", () => sendScheduledMessage("evening"));

module.exports = { sendScheduledMessage };
