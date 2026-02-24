import Student from "../../Models/Students/StudentsSchema.js";

export const createStudent = async (req, res) => {
  try {
    console.log("create Student", req.body);

    const {
      studentName,
      studentRoll,
      department,
      year,
      teacherId,
    } = req.body;

    const { role } = req.user;

    if (role !== "controller" && role !== "teacher") {
      return res.status(403).json({ message: "Access denied , only controllers and teachers can create students" });
    }

    // Auth check
    const loggedUser = req.user;



    if (!loggedUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Only admin OR teacher can create
    if (
      loggedUser.role !== "controller" &&
      loggedUser.role !== "teacher"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to add student" });
    }

    // If teacher role, prevent other-department adds
    if (
      loggedUser.role !== "teacher"

    ) {
      return res
        .status(403)
        .json({ message: "Teachers can only add students in their department" });
    }

    // Basic validation
    if (
      !studentName ||
      !studentRoll ||
      !department ||
      !year ||
      !teacherId
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

    const existing = await Student.findOne({ studentRoll });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Roll number already exists" });
    }

    const newStudent = new Student({
      studentName: studentName.trim(),
      studentRoll: studentRoll.trim(),
      department: department.trim(),
      year: year.trim(),
      teacherId,
    });

    await newStudent.save();

    res.status(201).json({
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (error) {
    console.error("Create Student Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const editStudent = async (req, res) => {
  try {
    const { role } = req.user;
    const { studentName, studentRoll, department, year } = req.body;


    const { id } = req.params;
    const studentId = id;



    // Authorization
    if (!["controller", "teacher"].includes(role)) {
      return res.status(403).json({
        message: "Access denied. Only controllers and teachers can edit students."
      });
    }

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // Find current student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // ✅ Check if studentRoll already exists (excluding current student)
    if (studentRoll && studentRoll !== student.studentRoll) {
      const rollExists = await Student.findOne({
        studentRoll,
        _id: { $ne: studentId }
      });

      if (rollExists) {
        return res.status(409).json({
          message: "Student roll already exists."
        });
      }
    }

    // Build update object
    const updateData = {
      studentName: studentName ?? student.studentName,
      studentRoll: studentRoll ?? student.studentRoll,
      department: department ?? student.department,
      year: year ?? student.year
    };

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Student updated successfully.",
      student: updatedStudent
    });

  } catch (error) {
    console.error("Edit student error:", error);
    return res.status(500).json({
      message: "Something went wrong while updating the student."
    });
  }
};



export const deleteStudent = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;
    const studentId = id;



    // Authorization
    if (!["controller", "teacher"].includes(role)) {
      return res.status(403).json({
        message: "Access denied. Only controllers and teachers can delete students."
      });
    }

    // Validate studentId
    if (!studentId) {
      return res.status(400).json({
        message: "Student ID is required."
      });
    }

    // Delete student
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    return res.status(200).json({
      message: "Student deleted successfully."
    });

  } catch (error) {
    console.error("Delete student error:", error);
    return res.status(500).json({
      message: "Something went wrong while deleting the student."
    });
  }
};
