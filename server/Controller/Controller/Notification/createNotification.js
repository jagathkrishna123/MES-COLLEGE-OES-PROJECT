import Notification from "../../../Models/Notifiaction/NotificationSchema.js";
import Teacher from "../../../Models/Teacher/TeacherSchema.js";
import mongoose from "mongoose";

export const createNotification = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { title, message, priority = "normal", type } = req.body;

    const teacherIds =
      req.body.teacherIds ||
      req.body.recipients ||
      req.body.TecherIds;

    const { role } = req.user;

    if (role !== "controller") {
      return res.status(403).json({
        message: "Access denied, only controllers can create notifications",
      });
    }

    if (!title || !message || !type) {
      return res.status(400).json({
        message: "Title, message, and type are required",
      });
    }

    if (!["all", "specific", "multiple"].includes(type)) {
      return res.status(400).json({
        message: "Invalid notification type",
      });
    }

    let targetTeacherIds = [];

    // CASE 1: Send to ALL teachers
    if (type === "all") {
      const allTeachers = await Teacher.find({}, "_id").lean();

      if (!allTeachers.length) {
        return res.status(404).json({ message: "No teachers found" });
      }

      targetTeacherIds = allTeachers.map((t) => t._id);
    }

    // CASE 2: Specific / Multiple teachers
    if (type === "specific" || type === "multiple") {
      if (!Array.isArray(teacherIds) || teacherIds.length === 0) {
        return res.status(400).json({
          message: "teacherIds array is required for this notification type",
        });
      }

      // if (type === "specific" && teacherIds.length !== 1) {
      //   return res.status(400).json({
      //     message: "Specific notifications require exactly one teacherId",
      //   });
      // }

      const validTeacherIds = teacherIds.filter((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );

      if (!validTeacherIds.length) {
        return res.status(400).json({
          message: "No valid teacherIds provided",
        });
      }

      const foundTeachers = await Teacher.find(
        { _id: { $in: validTeacherIds } },
        "_id"
      ).lean();

      if (!foundTeachers.length) {
        return res.status(404).json({
          message: "No matching teachers found",
        });
      }

      targetTeacherIds = foundTeachers.map((t) => t._id);
    }

    // Now create ONE notification with teacherIds as array
    const notification = await Notification.create({
      title,
      message,
      priority,
      type,
      status: "unread",
      teacherIds: targetTeacherIds, // ✅ array of IDs in one document
    });

    return res.status(201).json({
      message: "Notification(s) sent successfully",
      totalSent: targetTeacherIds.length,
      notification,
    });

  } catch (error) {
    console.error("Create notification error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const { role } = req.user;

  if (role !== "controller") {
    return res.status(403).json({
      message: "Access denied, only controllers can delete notifications",
    });
  }

  try {
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    await Notification.findByIdAndDelete(id);

    return res.status(200).json({ message: "Notification deleted successfully" });

  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({ message: "Server error" });
  }
};