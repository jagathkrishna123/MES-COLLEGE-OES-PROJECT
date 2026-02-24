import Department from "../../../Models/Department/Department.js";
import Exam from "../../../Models/Exams/ExamSchema.js";
import Student from "../../../Models/Students/StudentsSchema.js";
import Teacher from "../../../Models/Teacher/TeacherSchema.js"; // adjust path

export const getControllerDashboardData = async (req, res) => {
    try {
        const { role } = req.user;

        const [
            totalTeachers,
            totalStudents,
            pendingExams,
            evaluatedExams,
            departments,
            recentExams,
            recentTeachers
        ] = await Promise.all([
            Teacher.countDocuments(),
            Student.countDocuments(),
            Exam.countDocuments({ status: "pending" }),
            Exam.countDocuments({ status: "completed" }),
            Department.find().lean(),
            Exam.find().sort({ createdAt: -1 }).limit(5).lean(),
            Teacher.find().sort({ createdAt: -1 }).limit(5).select("name createdAt").lean(),
        ]);

        // Combine and format recent activities
        const activities = [
            ...recentExams.map(exam => ({
                id: `exam-${exam._id}`,
                message: `New exam created: ${exam.title} (${exam.subject})`,
                time: exam.createdAt,
                type: "exam"
            })),
            ...recentTeachers.map(teacher => ({
                id: `teacher-${teacher._id}`,
                message: `New teacher registered: ${teacher.name}`,
                time: teacher.createdAt,
                type: "teacher"
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);

        // Count total departments
        const totalDepartments = departments.length;

        // Count total subjects using reduce — subjects are inside each department
        const totalSubjects = departments.reduce((acc, dept) => {
            return acc + (dept.subjects?.length || 0);
        }, 0);

        const stats = {
            totalTeachers,
            totalDepartments,
            totalStudents,
            totalSubjects,
            pendingExams,
            evaluatedExams,
        };

        return res.status(200).json({
            success: true,
            stats,
            recentActivities: activities
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data",
            error: error.message,
        });
    }
};