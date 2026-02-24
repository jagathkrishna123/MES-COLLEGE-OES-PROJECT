import Teacher from "../../Models/Teacher/TeacherSchema.js";

// Get logged-in teacher info
export const GetTeacher = async (req, res) => {

    try {
        // If using JWT auth middleware, req.userId is available
        const teacherId = req.user.id; // assume your auth middleware sets this




        if (!teacherId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const teacher = await Teacher.findById(teacherId).select(
            "-password" // exclude password for security
        );

        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        res.status(200).json({ teacher });
    } catch (error) {
        console.error("GetTeacher error:", error);
        res.status(500).json({ message: "Server error" });
    }
};



// Admin-only: get all teachers
export const GetAllTeachers = async (req, res) => {
    try {



        // Check role from req.user (set by verifyToken middleware)
        const { role } = req.user;
    
        
        if (role !== "controller") {
            return res.status(403).json({ message: "Forbidden: Controller only" });
        }

        // Fetch teachers, hide passwords
        const teachers = await Teacher.find().select("-password");
        res.status(200).json({ teachers });
    } catch (error) {
        console.error("GetAllTeachers error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
