import Exam from "../../Models/Exams/ExamSchema.js";
import Student from "../../Models/Students/StudentsSchema.js";
import Department from "../../Models/Department/Department.js";

export const getTeacherAnalyticsData = async (req, res) => {
    try {
        const { role, department: teacherDepartment } = req.user;

        if (role !== "teacher") {
            return res.status(403).json({
                success: false,
                message: "Access denied, only teachers can view these analytics",
            });
        }

        // 1. Fetch Summary Stats
        const [totalStudents, totalExams, deptData] = await Promise.all([
            Student.countDocuments({ department: teacherDepartment }),
            Exam.countDocuments({ department: teacherDepartment }),
            Department.findOne({ departmentName: teacherDepartment }).lean(),
        ]);

        const totalSubjects = deptData?.subjects?.length || 0;

        // 2. Exam Status Distribution
        const examStatusCounts = await Exam.aggregate([
            { $match: { department: teacherDepartment } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const statusMap = {
            pending: 0,
            evaluating: 0,
            submitted: 0,
            completed: 0,
        };

        examStatusCounts.forEach((s) => {
            if (statusMap[s._id] !== undefined) {
                statusMap[s._id] = s.count;
            }
        });

        const examStatusData = Object.keys(statusMap).map((key) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1),
            value: statusMap[key],
        }));

        // 3. Performance Data (Average marks per exam)
        const exams = await Exam.find({ department: teacherDepartment })
            .select("subject title students status")
            .lean();

        const performanceData = exams
            .filter(exam => exam.status === "completed" || exam.status === "submitted")
            .map((exam) => {
                const evaluatedStudents = exam.students.filter(
                    (s) => s.status === "evaluated"
                );
                const avgMarks =
                    evaluatedStudents.length > 0
                        ? evaluatedStudents.reduce((acc, s) => {
                            const marks = s.marks !== undefined ? s.marks : (s.subjects?.[0]?.marks || 0);
                            return acc + marks;
                        }, 0) / evaluatedStudents.length
                        : 0;

                return {
                    name: exam.subject,
                    avgMarks: parseFloat(avgMarks.toFixed(2)),
                    totalStudents: exam.students.length,
                    evaluated: evaluatedStudents.length,
                };
            });

        // 4. Monthly Creation Trends (Last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const trends = await Exam.aggregate([
            {
                $match: {
                    department: teacherDepartment,
                    createdAt: { $gte: sixMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const trendData = trends.map((t) => ({
            month: monthNames[t._id.month - 1],
            exams: t.count,
        }));

        const stats = {
            totalStudents,
            totalExams,
            totalSubjects,
            examStatusData,
            performanceData,
            trends: trendData,
            department: teacherDepartment,
        };

        return res.status(200).json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error("Teacher Analytics Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch teacher analytics data",
            error: error.message,
        });
    }
};
