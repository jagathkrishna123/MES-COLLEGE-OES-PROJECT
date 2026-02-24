import Department from "../../Models/Department/Department.js";
import Exam from "../../Models/Exams/ExamSchema.js";
import Student from "../../Models/Students/StudentsSchema.js";
import Notification from "../../Models/Notifiaction/NotificationSchema.js";
import { LoginTeacher } from "./login&signup.js";

export const getTeacherDashboardData = async (req, res) => {


    try {
        const { role, department: teacherDepartment, id: teacherId, teacherName } = req.user;
        // console.log(teacherId,"idd");


        if (role !== "teacher") {
            return res.status(403).json({ message: "Access denied, only teachers can view this dashboard" });
        }

        const [
            totalStudents,
            pendingExams,
            evaluatedExams,
            department

        ] = await Promise.all([
            // Students in teacher's department only
            Student.countDocuments({ department: teacherDepartment }),

            // Exams in teacher's department only
            Exam.countDocuments({ department: teacherDepartment, status: "pending" }),
            Exam.countDocuments({ department: teacherDepartment, status: "completed" }),

            // Teacher's department with subjects inside
            Department.find({ departmentName: teacherDepartment }).lean(),

            // Recent exams in teacher's department
            Exam.find({ department: teacherDepartment })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("department")
                .lean(),

            // Notifications for this teacher

        ]);

        const notifications = await Notification.find({
            $or: [
                { teacherIds: teacherId },
                { type: "all" },
            ],
            status: "unread",  // ✅ only unread notifications
        })
            .sort({ createdAt: -1 })
            .limit(10)
            .lean()


        // Subjects inside teacher's department using reduce
        const totalSubjects = department.reduce((acc, dept) => {
            return acc + (dept.subjects?.length || 0);
        }, 0);


        const allSubjects = department.flatMap(dept => dept.subjects || []);
        
        

        const stats = {
            totalStudents,
            totalSubjects,
            allSubjects,
            pendingExams,
            evaluatedExams,
            departmentName: teacherDepartment,
            teacherName: teacherName,


        };

        // Build recent activities from real exams
        // const recentActivities = recentExams.map((exam) => ({
        //     id: exam._id,
        //     message: `Exam created for ${exam.department?.name || "your department"}`,
        //     time: exam.createdAt,
        //     type: "exam",
        // }));
        // console.log(notifications,"not");


        return res.status(200).json({
            success: true,
            stats,
            notifications,
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