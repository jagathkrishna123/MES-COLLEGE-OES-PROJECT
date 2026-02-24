import Student from "../../Models/Students/StudentsSchema.js";

export const getStudents = async (req, res) => {
  try {
    const { department } = req.query;

    let students;

    if (department) {
      // Fetch only students of the given department
      students = await Student.find({ department }).sort({ createdAt: -1 });
    } else {
      // Fetch all students
      students = await Student.find({}).sort({ createdAt: -1 });
    }

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
      message: students.length === 0 ? "No students found" : undefined,
    });

  } catch (error) {
    console.error("Error getting students:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching students",
      error: error.message,
    });
  }
};
