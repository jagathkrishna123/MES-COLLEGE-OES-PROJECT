import React, { useState, useEffect } from "react";
import { FaUserPlus, FaUser, FaIdBadge, FaSchool, FaCalendarAlt, FaCheck } from "react-icons/fa";
import axios from "axios";
const AddStudent = () => {
  const [teacher, setTeacher] = useState({ id: "", name: "" });
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [availableYears, setAvailableYears] = useState([]);


  const [formData, setFormData] = useState({
    studentName: "",
    studentRoll: "",
    department: "",
    year: "",
    teacherId: "",
  });
  console.log(teacher, "teacher");






  /* =========================
     LOAD TEACHER INFO AND DEPARTMENTS
     ========================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1️⃣ Fetch logged-in teacher info from backend
        const teacherRes = await axios.get("/getTeacher", {
          withCredentials: true, // needed if JWT is in HTTP-only cookie
        });



        const teacherData = teacherRes.data.teacher;


        if (teacherData) {
          setTeacher(teacherData);

          setFormData((prev) => ({
            ...prev,
            teacherId: teacherData.teacherId,
            department: teacherData.department || "",
          }));
        }

        // 2️⃣ Fetch departments from backend
        const deptRes = await axios.get("/getDepartment", {
          withCredentials: true,
        });


        const departmentsData = Array.isArray(deptRes.data?.departments) ? deptRes.data.departments : [];

        setDepartments(departmentsData);

        // 3️⃣ Set available years based on teacher's department
        if (teacherData?.department) {
          const matchingDepts = departmentsData.filter(
            (d) => d.departmentName === teacherData.department
          );
          const years = [...new Set(matchingDepts.map(d => d.year))];
          setAvailableYears(years);
        }

      } catch (error) {
        console.error("Failed to load teacher or departments:", error);
        setDepartments([]);
        setAvailableYears([]);
      }
    };

    fetchData();
  }, []);

  /* =========================
     HANDLE CHANGE
     ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Reset year when department changes
    if (name === "department") {
      const matchingDepts = departments.filter((d) => d.departmentName === value);
      const years = [...new Set(matchingDepts.map(d => d.year))];
      setAvailableYears(years);

      setFormData({
        ...formData,
        department: value,
        year: "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  /* =========================
     SUBMIT
     ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Frontend validation
    if (
      !formData.studentName.trim() ||
      !formData.studentRoll.trim() ||
      !formData.department.trim() ||
      !formData.year.trim()
    ) {
      showMessage("❌ Please fill all required fields.", "error");
      return;
    }

    try {
      // 2️⃣ Prepare payload
      const payload = {
        studentName: formData.studentName.trim(),
        studentRoll: formData.studentRoll.trim(),
        department: formData.department.trim(),
        year: formData.year.trim(),
        teacherId: teacher.teacherId.trim(),
      };

      // 3️⃣ Axios POST request
      const response = await axios.post(
        "/createStudent", // <-- make sure this matches your backend route
        payload,
        {
          withCredentials: true, // include cookies if you have session auth
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 4️⃣ Handle success
      if (response.status === 201) {
        showMessage("✅ Student added successfully!", "success");

        setTimeout(() => {
          window.location.reload();
        }, 1000);

        // Reset form data
        setFormData({
          studentName: "",
          studentRoll: "",
          department: teacher.department || "",
          year: "",
          teacherId: teacher.id,
        });

        // Update available years dynamically
        if (teacher.department) {
          const matchingDepts = departments.filter(
            (d) => d.departmentName === teacher.department
          );
          const years = [...new Set(matchingDepts.map(d => d.year))];
          setAvailableYears(years);
        } else {
          setAvailableYears([]);
        }
      }
    } catch (error) {
      console.error("Add Student Error:", error);

      // Show error message from backend if available
      const msg =
        error.response?.data?.message || "Failed to add student. Try again.";
      showMessage(`❌ ${msg}`, "error");
    }
  };


  const yearsArray = Array.isArray(availableYears) ? availableYears : [];
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaUserPlus className="text-blue-600" />
          Add New Student
        </h1>
        <p className="text-gray-600">
          Register a new student to your department and academic year.
        </p>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg text-center font-medium ${messageType === "success"
          ? "bg-green-100 text-green-700 border border-green-300"
          : messageType === "error"
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
          }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Teacher Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaUser className="text-blue-600" />
            Teacher Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <FaUser className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{teacher.name || "Not logged in"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <FaIdBadge className="text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Teacher ID</p>
                <p className="font-medium text-gray-900">{teacher.teacherId || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Student Form */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaUserPlus className="text-green-600" />
            Student Registration Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  Student Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter full student name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Roll Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaIdBadge className="text-green-500" />
                  Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentRoll"
                  value={formData.studentRoll}
                  onChange={handleChange}
                  placeholder="e.g., CS001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaSchool className="text-purple-500" />
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  required
                >
                  <option value="">Select Department</option>

                  {Array.from(
                    new Set(departments.map((dept) => dept.departmentName))
                  ).map((deptName) => (
                    <option key={deptName} value={deptName}>
                      {deptName}
                    </option>
                  ))}

                </select>
              </div>

              {/* Year */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-orange-500" />
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={!formData.department}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">
                    {formData.department ? "Select Academic Year" : "Select Department First"}
                  </option>
                  {Array.isArray(yearsArray) &&
                    yearsArray.map((yr) => (
                      <option key={yr} value={yr}>
                        {yr}
                      </option>
                    ))
                  }

                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 font-medium shadow-md hover:shadow-lg"
              >
                <FaCheck />
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
