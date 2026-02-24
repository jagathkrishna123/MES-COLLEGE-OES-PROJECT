import Teacher from "../../../Models/Teacher/TeacherSchema.js";

export const updateTeacherStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const { status } = req.body;

        const { role } = req.user;
        if (role !== "controller") {
            return res.status(403).json({
                success: false,
                message: "Forbidden: Controller only",
            });
        }
        // Validate status
        if (!["active", "blocked"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value",
            });
        }

        // Update teacher
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedTeacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: `Teacher has been ${status === "active" ? "activated" : "blocked"}`,
            data: updatedTeacher,
        });
    } catch (error) {
        console.error("Update Teacher Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while updating teacher status",
        });
    }
};




export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
   

        const { role } = req.user;

        // Authorization check
        if (role !== "controller") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Controller role required.",
            });
        }

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Teacher ID is required.",
            });
        }

        const deletedTeacher = await Teacher.findByIdAndDelete(id);

        if (!deletedTeacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Teacher deleted successfully.",
            data: deletedTeacher,
        });
    } catch (error) {
        console.error("Delete Teacher Error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error while deleting teacher.",
        });
    }
};
