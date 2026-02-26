import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSchool, FaCalendarAlt, FaBook, FaSave, FaSync } from "react-icons/fa";
import axios from 'axios';

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

const AddDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [departmentName, setDepartmentName] = useState("");
  const [year, setYear] = useState("");
  const [subjectInput, setSubjectInput] = useState("");
  const [subjects, setSubjects] = useState([]);

  // Fetch departments from backend on component mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/getDepartment', {
        withCredentials: true
      });
      if (response.data && response.data.departments) {
        // setDepartments(response.data.departments);
        setDepartments([...response.data.departments].reverse());
        console.log("✅ Fetched departments from backend:", response.data.departments.length);
      }
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
      showMessage("❌ Failed to load departments from database", "error");
    } finally {
      setLoading(false);
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

  const addSubject = () => {
    if (!subjectInput.trim()) {
      showMessage("❌ Please enter a subject name.", "error");
      return;
    }

    if (subjects.includes(subjectInput.trim())) {
      showMessage("⚠️ Subject already added to this year.", "warning");
      return;
    }

    setSubjects([...subjects, subjectInput.trim()]);
    setSubjectInput("");
    showMessage(`✅ Subject "${subjectInput.trim()}" added!`, "success");
  };

  const removeSubject = (index) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const createDepartment = async () => {
    if (!departmentName.trim() || !year || subjects.length === 0) {
      showMessage(
        "❌ Please fill in department name, select a year, and add at least one subject.",
        "error"
      );
      return;
    }

    try {
      const payload = {
        name: departmentName.trim(),
        year,
        subjects
      };

      const response = await axios.post(
        '/createDepartment',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      showMessage("✅ Department created successfully!", "success");

      // Reset form
      setYear("");
      setSubjects([]);
      setSubjectInput("");
      setDepartmentName("");

      // Refresh list
      fetchDepartments();
    } catch (error) {
      console.error("Error creating department:", error);
      showMessage(
        error.response?.data?.message || "❌ Failed to create department. Try again.",
        "error"
      );
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department entry?")) return;

    try {
      await axios.delete(`/deleteDepartment/${id}`, {
        withCredentials: true
      });
      showMessage("🗑️ Department deleted successfully", "success");
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      showMessage(
        error.response?.data?.message || "❌ Failed to delete department.",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <FaSchool className="text-blue-600" />
              Manage Departments & Subjects
            </h1>
            <p className="text-gray-600">
              Create and manage academic departments with their respective subjects and years.
            </p>
          </div>
          <button
            onClick={fetchDepartments}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 font-medium"
          >
            <FaSync className={loading ? "animate-spin" : ""} />
            Refresh List
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg text-center font-medium ${messageType === "success" ? "bg-green-100 text-green-700 border border-green-300" :
          messageType === "error" ? "bg-red-100 text-red-700 border border-red-300" :
            "bg-yellow-100 text-yellow-700 border border-yellow-300"
          }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Department Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <FaPlus className="text-green-600" />
            Create Department
          </h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaSchool className="text-blue-500" />
                Department Name
              </label>
              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="e.g., Computer Science Engineering"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-purple-500" />
                Academic Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="">Select Year</option>
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FaBook className="text-green-500" />
                Add Subject
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  placeholder="e.g., Data Structures & Algorithms"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                />
                <button
                  type="button"
                  onClick={addSubject}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium"
                >
                  <FaPlus className="inline mr-2" />
                  Add
                </button>
              </div>
            </div>

            {subjects.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Subjects Added ({subjects.length})</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {subjects.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                      <span className="text-gray-700 font-medium">{subject}</span>
                      <button onClick={() => removeSubject(index)} className="text-red-500 hover:text-red-700 transition-colors p-1">
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={createDepartment}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium"
            >
              <FaSave />
              Save Department & Subjects
            </button>
          </div>
        </div>

        {/* Departments Display */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <FaSchool className="text-blue-600" />
              Departments ({departments.length})
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading departments...</p>
            </div>
          ) : departments.length === 0 ? (
            <div className="text-center py-12">
              <FaSchool className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Departments Found</h3>
              <p className="text-gray-600">Start by creating your first department.</p>
            </div>
          ) : (
            <div className="space-y-8 max-h-[800px] overflow-y-auto pr-2">
              {Object.entries(
                departments.reduce((acc, dept) => {
                  if (!acc[dept.departmentName]) acc[dept.departmentName] = [];
                  acc[dept.departmentName].push(dept);
                  return acc;
                }, {})
              ).map(([name, entries]) => (
                <div key={name} className="border border-gray-200 rounded-xl p-5 bg-gray-50/30">
                  <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-200 pb-2">
                    <FaSchool className="text-blue-600" />
                    {name}
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {entries.map((dept) => (
                      <div
                        key={dept._id}
                        className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300 relative"
                      >
                        <button
                          onClick={() => handleDeleteDepartment(dept._id)}
                          className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Entry"
                        >
                          <FaTrash size={14} />
                        </button>

                        <div className="flex items-center gap-2 mb-3">
                          <FaCalendarAlt className="text-purple-500" />
                          <span className="font-bold text-gray-800">{dept.year}</span>
                        </div>

                        <div className="ml-6 space-y-1">
                          {Array.isArray(dept.subjects) ? (
                            dept.subjects.map((sub, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                <FaBook className="text-green-500 text-xs" />
                                {sub}
                              </div>
                            ))
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FaBook className="text-green-500 text-xs" />
                              {dept.subjects}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddDepartment;
