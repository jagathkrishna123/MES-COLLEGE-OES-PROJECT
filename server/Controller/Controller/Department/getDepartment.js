import Department from "../../../Models/Department/Department.js";

export const getDepartment = async (req, res) => {
    try {
     
        
        const departments = await Department.find();
        res.status(200).json({ departments });
    } catch (error) {
        console.error("Get Department Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};