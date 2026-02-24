import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    studentRoll: {
      type: String,
      required: [true, "Student roll is required"],
      trim: true,
      unique: true, // optional — ensures no duplicates
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    teacherId: {
      type: String,
      ref: "Teacher", // if you have a teacher model
      required: [true, "Teacher ID is required"],
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", StudentSchema);
export default Student;
