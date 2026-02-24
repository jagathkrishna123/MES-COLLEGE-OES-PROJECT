import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    departmentName: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String, // String or Number, both work
      required: true,
      trim: true,
    },
    subjects: {
      type: [String], // <-- array of strings
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Department = mongoose.model("Department", DepartmentSchema);
export default Department;
