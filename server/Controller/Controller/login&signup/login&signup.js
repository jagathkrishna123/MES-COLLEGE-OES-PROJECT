import bcrypt from "bcryptjs";
import Controller from "../../../Models/Controller/ControllerSchema.js";
import jwt from "jsonwebtoken";

// Create a new controller (signup)
export const CreateController = async (req, res) => {
  try {
    // Use dynamic values from req.body or fallback to defaults

    const name = "Controller"
    const email = "controller@gmail.com"
    const password = "123"

    // Check if controller already exists
    const existingController = await Controller.findOne({ email });
    if (existingController) {
      return res.status(400).json({ message: "Controller already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new controller
    const newController = new Controller({
      name,
      email,
      password: hashedPassword,
      role: "controller", // explicitly set role
    });

    await newController.save();

    // Remove password before sending response
    const controllerResponse = {
      _id: newController._id,
      name: newController.name,
      email: newController.email,
      role: newController.role,
      createdAt: newController.createdAt,
      updatedAt: newController.updatedAt,
    };

    res.status(201).json({ message: "Controller created successfully", controller: controllerResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};





// Make sure you have JWT_SECRET in your .env
// e.g., JWT_SECRET=supersecretkey
const JWT_EXPIRES_IN = "1d"; // Token validity

export const ControllerLogin = async (req, res) => {



  try {
    const { email, password } = req.body;
    console.log(email, password);

    // 1️⃣ Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2️⃣ Find the controller by email
    const controller = await Controller.findOne({ email });
    if (!controller) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, controller.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: controller._id, role: controller.role },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 5️⃣ Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only over HTTPS in production
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });



    // 6️⃣ Send response without password
    res.status(200).json({
      message: "Login successful",
      controller: {
        id: controller._id,
        name: controller.name,
        email: controller.email,
        role: controller.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

