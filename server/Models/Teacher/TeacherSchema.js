import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacherId: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ["teacher", "admin"],
    default: "teacher"
  },

  // ✔ New status field
  status: {
    type: String,
    enum: ["active", "blocked", "pending"], // restrict possible values
    default: "blocked"                         // initial status
  }

}, {
  timestamps: true
});

export default mongoose.model("Teacher", TeacherSchema);
