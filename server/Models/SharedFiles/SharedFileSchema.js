import mongoose from "mongoose";

const SharedFileSchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        teacherName: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        remark: {
            type: String,
        },
        fileName: {
            type: String,
            required: true,
        },
        fileUrl: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const SharedFile = mongoose.model("SharedFile", SharedFileSchema);
export default SharedFile;
