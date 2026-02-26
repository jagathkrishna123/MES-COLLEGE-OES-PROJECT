import Exam from "../../../Models/Exams/ExamSchema.js";
import mongoose from "mongoose";

export const createExam = async (req, res) => {
  try {
    const { title, department, year, subject, studentsData } = req.body;
    const { role } = req.user;

    if (role !== "controller") {
      return res
        .status(403)
        .json({ message: "Access denied, only controllers can create exams" });
    }

    if (!title || !department || !year || !subject || !studentsData) {
      return res.status(400).json({ message: "All exam fields are required" });
    }

    // Parse students
    let studentsArray =
      typeof studentsData === "string"
        ? JSON.parse(studentsData)
        : studentsData;

    // 🔥 Initialize subject for each student
    studentsArray = studentsArray.map((student) => ({
      ...student,
      subjects: [
        {
          subjectName: subject,
          marks: null,
          grade: null,
        },
      ],
    }));

    // Map uploaded student files
    if (req.files?.studentsFiles) {
      req.files.studentsFiles.forEach((file, index) => {
        if (studentsArray[index]) {
          studentsArray[index].file = file.path;
        }
      });
    }

    const questionPaper = req.files?.questionPaper?.[0]?.path || null;
    const answerKey = req.files?.answerKey?.[0]?.path || null;

    const newExam = new Exam({
      title,
      department,
      year,
      subject,
      students: studentsArray,
      questionPaper,
      answerKey,
      status: "pending",
    });

    await newExam.save();

    res.status(201).json({
      message: "Exam created successfully",
      exam: newExam,
    });
  } catch (error) {
    console.error("Create Exam Error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
export const getAllExams = async (req, res) => {
  try {
    const { role, department } = req.user;

    let filter = {};

    if (role === "controller") {
      // Controller → no filter (see all)
      filter = {};
    }
    else if (role === "teacher") {
      // Teacher → only their department
      filter = { department: department };
    }
    else {
      // NOT teacher AND NOT controller → only completed
      filter = { status: "completed" };
    }

    const exams = await Exam.find(filter)
      .sort({ createdAt: -1 })
      .lean();


    return res.status(200).json({
      success: true,
      count: exams.length,
      data: exams,
    });

  } catch (error) {
    console.error("Error fetching exams:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch exams",
    });
  }
};





export const evaluateExam = async (req, res) => {
  try {



    const {
      examId,
      studentId,
      subject,
      marks,
      outOfMarks,
      comments,
      outOfMarksStructure,
      questionCount,
    } = req.body;

    const { role } = req.user;


    if (role !== "controller" && role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Access denied, only controllers and Teacher can evaluate exams" });
    }
    /* -------------------- 1️⃣ Validation -------------------- */
    if (
      !examId ||
      !studentId ||
      !subject ||
      marks === undefined ||
      outOfMarks === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }


    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return res.status(400).json({
        message: "Invalid exam ID",
      });
    }

    if (marks < 0 || marks > outOfMarks) {
      return res.status(400).json({
        message: "Invalid marks value",
      });
    }

    /* -------------------- 2️⃣ Find Exam -------------------- */
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        message: "Exam not found",
      });
    }

    // 🔒 Prevent evaluation after submission
    if (exam.status === "submitted" || exam.status === "completed") {
      return res.status(400).json({
        message: "Exam evaluation is already finalized",
      });
    }

    /* -------------------- 3️⃣ Find Student -------------------- */
    const student = exam.students.find(
      (s) => s.studentId.toString() === studentId.toString()
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    /* -------------------- 4️⃣ Grade Calculation -------------------- */
    const percentage = (marks / outOfMarks) * 100;
    let grade = "F";

    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 35) grade = "D";

    /* -------------------- 5️⃣ Update / Insert Subject -------------------- */
    const existingSubject = student.subjects.find(
      (sub) => sub.subjectName === subject
    );

    if (existingSubject) {
      existingSubject.marks = marks;
      existingSubject.grade = grade;
      existingSubject.comments = comments;
      existingSubject.status = "evaluated";
    } else {
      student.subjects.push({
        subjectName: subject,
        marks,
        grade,
        comments,
        status: "evaluated",
      });
    }

    /* -------------------- 6️⃣ Student Evaluation Status -------------------- */
    const allSubjectsEvaluated = student.subjects.every(
      (sub) => sub.status === "evaluated"
    );

    if (allSubjectsEvaluated) {
      student.status = "evaluated";
      if (outOfMarksStructure) {
        student.outOfMarksStructure = outOfMarksStructure;
      }
      if (questionCount) {
        student.questionCount = questionCount;
      }
    }


    /* -------------------- 7️⃣ Exam Evaluation Status -------------------- */
    const allStudentsEvaluated = exam.students.every(
      (s) => s.status === "evaluated"
    );

    if (allStudentsEvaluated) {
      exam.status = "submitted";
      exam.totalMarks = outOfMarks;
      exam.submittedAt = new Date();
    } else if (exam.status !== "evaluating") {
      exam.status = "evaluating";
    }

    /* -------------------- 8️⃣ Save -------------------- */
    await exam.save();

    return res.status(200).json({
      message: allStudentsEvaluated
        ? "Exam evaluation submitted successfully"
        : "Student evaluated successfully",
      examStatus: exam.status,
      student,
    });
  } catch (error) {
    console.error("Evaluation error:", error);
    return res.status(500).json({
      message: "Failed to evaluate exam",
      error: error.message,
    });
  }
};




// export const updateExam = async (req, res) => {
//   try {
//     console.log("he");

//     const { id } = req.params; // exam ID from URL
//     console.log(id, "exam Id");


//     // Find the exam by ID and update the status to "submitted"
//     const updatedExam = await Exam.findByIdAndUpdate(
//       id,
//       { status: "submitted" },
//       { new: true } // return the updated document
//     );

//     if (!updatedExam) {
//       return res.status(404).json({ message: "Exam not found" });
//     }

//     return res.status(200).json({ message: "Exam status updated", exam: updatedExam });
//   } catch (error) {
//     console.error("Error updating exam:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


export const publishExam = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("publish exam id", id);


    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    // 2. Check if exam exists
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // 3. Prevent re-publishing
    if (exam.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Exam is already published",
      });
    }

    // 4. Update status
    exam.status = "completed";
    await exam.save();

    return res.status(200).json({
      success: true,
      message: "Exam published successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Publish exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while publishing the exam",
    });
  }
};
export const unpublishExam = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("unpublish exam id", id);

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid exam ID",
      });
    }

    // 2. Check if exam exists
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: "Exam not found",
      });
    }

    // 3. Verify if it's already unpublished or in another state
    if (exam.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Exam is not published yet",
      });
    }

    // 4. Update status back to "submitted"
    exam.status = "submitted";
    await exam.save();

    return res.status(200).json({
      success: true,
      message: "Exam unpublished successfully",
      data: exam,
    });
  } catch (error) {
    console.error("Unpublish exam error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while unpublishing the exam",
    });
  }
};
