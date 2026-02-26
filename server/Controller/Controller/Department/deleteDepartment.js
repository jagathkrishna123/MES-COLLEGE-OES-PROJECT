import Department from "../../../Models/Department/Department.js";

export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.user;

        if (role !== "controller") {
            return res.status(403).json({ message: "Access denied, only controllers can delete departments" });
        }

        const deletedDepartment = await Department.findByIdAndDelete(id);

        if (!deletedDepartment) {
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json({
            message: "Department deleted successfully",
            id: id
        });
    } catch (error) {
        console.error("Delete Department Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
