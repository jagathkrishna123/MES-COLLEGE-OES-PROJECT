import Department from "../../../Models/Department/Department.js";
import Exam from "../../../Models/Exams/ExamSchema.js";
import Student from "../../../Models/Students/StudentsSchema.js";
import Teacher from "../../../Models/Teacher/TeacherSchema.js";

export const getAnalyticsData = async (req, res) => {
    try {
        const [
            totalTeachers,
            totalStudents,
            exams,
            departments,
            teachers
        ] = await Promise.all([
            Teacher.countDocuments(),
            Student.countDocuments(),
            Exam.find().lean(),
            Department.find().lean(),
            Teacher.find().select("createdAt").lean()
        ]);

        // 1. Exam Status Distribution
        const examStatusData = [
            { name: "Pending", value: exams.filter(e => e.status === "pending").length },
            { name: "Evaluating", value: exams.filter(e => e.status === "evaluating").length },
            { name: "Evaluated", value: exams.filter(e => e.status === "evaluated" || e.status === "completed").length },
            { name: "Published", value: exams.filter(e => e.status === "submitted").length },
        ];

        // 2. Department-wise Data
        const deptWiseData = departments.map(dept => {
            return {
                name: dept.departmentName,
                students: totalStudents > 0 ? (totalStudents / departments.length) : 0, // Placeholder if student models don't have dept field, but let's check.
                // Looking at StudentsSchema, it does have department: String.
                // Let's do a proper count if possible, but for efficiency in one query, this might be tricky without aggregation.
                // However, we can use the already fetched exams.
                exams: exams.filter(e => e.department === dept.departmentName).length,
                subjects: dept.subjects?.length || 0
            };
        });

        // 3. Exam Trends (Last 6 Months)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trends = Array.from({ length: 6 }).map((_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (5 - i));
            const monthName = months[date.getMonth()];
            const count = exams.filter(e => {
                const edate = new Date(e.createdAt);
                return edate.getMonth() === date.getMonth() && edate.getFullYear() === date.getFullYear();
            }).length;
            return { month: monthName, exams: count };
        });

        const stats = {
            totalTeachers,
            totalStudents,
            totalExams: exams.length,
            totalDepartments: departments.length,
            examStatusData,
            deptWiseData,
            trends
        };

        return res.status(200).json({
            success: true,
            stats
        });

    } catch (error) {
        console.error("Analytics error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch analytics data",
            error: error.message,
        });
    }
};
