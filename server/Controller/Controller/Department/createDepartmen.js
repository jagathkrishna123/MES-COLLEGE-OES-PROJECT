import Department from "../../../Models/Department/Department.js";

export const createDepartment = async (req, res) => {
  try {
    const { name, year, subjects } = req.body;
   const {role} = req.user;
   
    if(role !== "controller"){
      return res.status(403).json({message: "Access denied , only controllers can create departments"});
    }
   

    // Basic validation
    if (!name || !year || !subjects || subjects.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const departmentName = name.trim();
    const normalizedYear = year.trim();
    const subjectArray = Array.isArray(subjects)
      ? subjects.map((sub) => sub.trim()).filter((sub) => sub !== "")
      : [];

    if (subjectArray.length === 0) {
      return res
        .status(400)
        .json({ message: "Provide at least one valid subject" });
    }

    // Check if a document already exists with the same department name AND year
    const exists = await Department.findOne({
      departmentName,
      year: normalizedYear,
    });

    if (exists) {
      return res.status(400).json({
        message: `Department "${departmentName}" already has an entry for year "${normalizedYear}".`,
      });
    }

    // Create the new department/year entry
    const newDepartment = new Department({
      departmentName,
      year: normalizedYear,
      subjects: subjectArray, // <-- store array correctly
    });

    await newDepartment.save();

    res.status(201).json({
      message: "Department entry created successfully",
      department: newDepartment,
    });
  } catch (error) {
    console.error("Create Department Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
