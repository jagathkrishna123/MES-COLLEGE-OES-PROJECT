import Notification from "../../../Models/Notifiaction/NotificationSchema.js"; // adjust path if needed

export const getNotification = async (req, res) => {
  try {


    const { id, role } = req.user;



    if (role !== "teacher" && role !== "controller") {
      return res.status(403).json({ message: "Access denied" });
    }

    let notifications;

    if (role === "teacher") {
      notifications = await Notification.find({ teacherIds: id })
        .populate("teacherIds", "name")
        .sort({ createdAt: -1 });
    } else {
      notifications = await Notification.find()
        .populate("teacherIds", "name")
        .sort({ createdAt: -1 });
    }

    if (!notifications.length) {
      return res.status(404).json({ message: "No notifications found" });
    }

    res.status(200).json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { role, id: userId } = req.user; // assuming req.user has _id
  console.log(userId, "id");

  try {
    // Find the notification
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Optional: check role or ownership
    if (role !== "teacher" && role !== "controller") {
      return res.status(403).json({ message: "You are not allowed to mark this notification as read" });
    }

    let updated = false;


    // Update status to "read" if not already
    if (notification.status !== "read") {
      notification.status = "read";
      updated = true;
    }

    // Save only if changes were made
    if (updated) {
      await notification.save();
    }

    return res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const updateAllNotification = async (req, res) => {
  try {
    const { id, role } = req.user;
    console.log(id, "id updateAll notification");


    if (role !== "teacher" && role !== "controller") {
      return res.status(403).json({
        message: "You are not allowed to mark notifications"
      });
    }

    // Add teacher id into readBy array + update status
    const result = await Notification.updateMany(
      { readBy: { $ne: id } }, // only unread for this teacher
      {
        $addToSet: { readBy: id }, // avoids duplicates
        $set: { status: "read" }
      }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
      updatedCount: result.modifiedCount,

    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
