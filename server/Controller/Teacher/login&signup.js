import bcrypt from "bcryptjs";
import Teacher from "../../Models/Teacher/TeacherSchema.js"; // Update path if needed
import jwt from "jsonwebtoken";

export const Teachersignup = async (req, res) => {
    try {


        const {
            name,
            email,
            password,
            confirmPassword,
            department,
            year,
            subject,
            teacherId,
        } = req.body;

        // Check for missing fields
        if (
            !name ||
            !email ||
            !password ||
            !confirmPassword ||
            !department ||
            !year ||
            !subject ||
            !teacherId
        ) {
            return res
                .status(400)
                .json({ message: "Please fill in all required fields." });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if user already exists
        // Check if email already exists
        const emailExists = await Teacher.findOne({ email });
        if (emailExists) {
            return res.status(400).json({ message: "Teacher with this email already exists." });
        }

        // Check if teacherId already exists
        const idExists = await Teacher.findOne({ teacherId });
        if (idExists) {
            return res.status(400).json({ message: "Teacher with this ID already exists." });
        }


        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await Teacher.create({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword, // Save hashed confirmPassword too (optional)
            department,
            year,
            subject,
            teacherId,
            role: "teacher", // default role
        });

        // Remove password fields from response
        const userResponse = {
            _id: user._id,
            name: user.name,
            email: user.email,
            department: user.department,
            year: user.year,
            subject: user.subject,
            teacherId: user.teacherId,
        };

        res.status(201).json({
            message: "User registered successfully",
            user: userResponse,
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Server error" });
    }
};




export const LoginTeacher = async (req, res) => {

    try {


        const { email, password } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // 2. Find teacher
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 3. Check password
        const isPasswordValid = await bcrypt.compare(password, teacher.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // 4. Check status
        if (teacher.status === "blocked") {
            return res.status(403).json({
                message: "Your account has been blocked. Please contact the administrator.",
            });
        }

        // 5. Create token
        const token = jwt.sign(
            { id: teacher._id, role: "teacher", department: teacher.department, teacherName: teacher.name },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        // 5. Set cookie
        res.cookie("token", token, {
            httpOnly: true,        // cannot be accessed by JS
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: "strict",    // protects against CSRF
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // 6. Response (no token exposed)
        res.status(200).json({
            message: "Login successful",
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email,
                department: teacher.department,
            },
        });

    } catch (error) {
        console.error("LoginTeacher error:", error);
        res.status(500).json({
            message: "Server error",
        });
    }
};
