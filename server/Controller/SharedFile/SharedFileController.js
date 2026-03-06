import SharedFile from "../../Models/SharedFiles/SharedFileSchema.js";
import Teacher from "../../Models/Teacher/TeacherSchema.js";
import path from "path";
import fs from "fs";

export const uploadSharedFile = async (req, res) => {
    try {
        const { subject, remark } = req.body;
        const teacherId = req.user.id;

        // Fetch teacher's name from DB
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        const teacherName = teacher.name;

        if (!req.files || !req.files.sharedFile) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.sharedFile[0];
        const fileName = file.originalname;
        const fileUrl = file.filename; // Multer saves it with unique suffix

        const newSharedFile = new SharedFile({
            teacherId,
            teacherName,
            subject,
            remark,
            fileName,
            fileUrl,
        });

        await newSharedFile.save();

        res.status(201).json({
            message: "File shared successfully",
            sharedFile: newSharedFile,
        });
    } catch (error) {
        console.error("❌ SharedFile Upload Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getAllSharedFiles = async (req, res) => {
    try {
        const sharedFiles = await SharedFile.find().sort({ createdAt: -1 });
        res.status(200).json(sharedFiles);
    } catch (error) {
        console.error("❌ Fetch SharedFiles Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
