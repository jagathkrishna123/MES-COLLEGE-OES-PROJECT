import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "evaluated"],
      default: "pending",
      required: true,
    },
    file: {
      type: String, // file path or URL
      default: null,
    },

    // ✅ NEW FIELD
    subjects: [
      {
        subjectName: {
          type: String,
          required: true,
          trim: true,
        },
        marks: {
          type: Number,
          min: 0,
        },
        grade: {
          type: String,
          trim: true,
        },
        comments: {
          type: String,
        }
      },
    ],
    outOfMarksStructure: {
      type: Map,
      of: Number,
      default: {},
    },
    questionCount: {
      type: Number,
      default: 10,
    },

  },
  {
    _id: false,
    timestamps: true,
  }
);


const ExamSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    examKey: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔥 NEW FIELD
    status: {
      type: String,
      enum: ["pending", "evaluated", "submitted", "completed", "evaluating"],
      default: "pending",
      required: true,
    },

    students: {
      type: [StudentSchema],
      default: [],
    },
    questionPaper: {
      type: String,
      default: null,
    },
    totalMarks: {
      type: String,
      default: null,
    },
    answerKey: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Exam = mongoose.model("Exam", ExamSchema);
export default Exam;
