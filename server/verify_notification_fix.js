import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Notification from "./Models/Notifiaction/NotificationSchema.js";
import Teacher from "./Models/Teacher/TeacherSchema.js";

const MONGO_URI = process.env.MONGODB_URI;

async function verifyPopulate() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB");

        const notifications = await Notification.find()
            .populate("teacherIds", "name")
            .limit(1)
            .lean();

        if (notifications.length > 0) {
            console.log("Notification found:", JSON.stringify(notifications[0], null, 2));
            if (notifications[0].teacherIds && notifications[0].teacherIds.length > 0) {
                if (typeof notifications[0].teacherIds[0] === 'object' && notifications[0].teacherIds[0].name) {
                    console.log("SUCCESS: Teacher names are populated.");
                } else {
                    console.log("FAILURE: Teacher ids are NOT populated or missing names.");
                }
            } else {
                console.log("NOTE: Notification has no teacherIds to populate.");
            }
        } else {
            console.log("No notifications found to test.");
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error("Test failed:", error);
    }
}

verifyPopulate();
