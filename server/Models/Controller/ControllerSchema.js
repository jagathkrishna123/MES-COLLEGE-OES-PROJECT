import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const ControllerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,       // prevents duplicate emails in DB
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["controller"],  // role must be "controller" or "admin"
    default: "controller",
  },
}, { timestamps: true });


const Controller = mongoose.model("Controller", ControllerSchema);
export default Controller;
