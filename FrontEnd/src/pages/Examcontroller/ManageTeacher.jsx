import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaSchool, FaCalendarAlt, FaBan, FaCheck, FaTrash, FaEdit, FaBook } from "react-icons/fa";
import axios from "axios";
const ManageTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Load teachers from TEACHERSDATA
  useEffect(() => {
    loadTeachers();
  }, []);

  // Filter teachers based on search and status
  useEffect(() => {
    let filtered = [...teachers];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.name && teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department && teacher.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subject && teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.year && teacher.year.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(teacher => teacher.status === statusFilter);
    }

    setFilteredTeachers(filtered);
  }, [teachers, searchTerm, statusFilter]);

  const loadTeachers = async () => {
    try {
      const response = await axios.get("/getAllTeachers", {
        withCredentials: true, // ✅ send cookies/credentials
      });



      setTeachers(response.data.teachers || response.data);
    } catch (error) {
      console.error("Error loading teachers:", error);
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

  const toggleTeacherStatus = async (teacherId) => {
    try {



      // Find teacher from current state
      const teacher = teachers.find(
        t => t._id === teacherId || t.teacherId === teacherId
      );

      if (!teacher) return;

      const newStatus = teacher.status === "active" ? "blocked" : "active";

      // Update status on server
      await axios.put(
        `/updateTeacherStatus/${teacherId}`,
        {
          status: newStatus,
        },
        {
          withCredentials: true,
        }
      );


      // Optimistically update UI
      const updatedTeachers = teachers.map(t =>
        t._id === teacherId || t.teacherId === teacherId
          ? { ...t, status: newStatus }
          : t
      );

      setTeachers(updatedTeachers);

      // Reload from server to stay in sync
      loadTeachers();

      showMessage(
        `Teacher ${teacher.name} has been ${newStatus === "active" ? "activated" : "blocked"}.`,
        newStatus === "active" ? "success" : "warning"
      );
    } catch (error) {
      console.error("Failed to update teacher status:", error);
      showMessage(
        "Failed to update teacher status. Please try again.",
        "error"
      );
    }
  };


  const deleteTeacher = async (teacherId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this teacher? This action cannot be undone."
      )
    ) {
      try {
        // Call backend API
        await axios.delete(`/deleteTeacher/${teacherId}`, {
          withCredentials: true,
        });

        // Reload teachers to refresh UI
        loadTeachers();

        const deletedTeacher = teachers.find(
          (t) => t._id === teacherId || t.teacherId === teacherId
        );

        if (deletedTeacher) {
          showMessage(
            `Teacher ${deletedTeacher.name} has been deleted.`,
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting teacher:", error);
        showMessage("Failed to delete teacher. Please try again.", "error");
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Active"
      },
      blocked: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Blocked"
      }
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaUser className="text-blue-600" />
          Manage Teachers
        </h1>
        <p className="text-gray-600">
          View and manage all registered teachers in the system.
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Teachers
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="sm:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            >
              <option value="all">All Teachers</option>
              <option value="active">Active Only</option>
              <option value="blocked">Blocked Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaUser className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Teachers Found</h3>
            <p className="text-gray-600">
              {teachers.length === 0
                ? "No teachers have registered yet."
                : "No teachers match your search criteria."}
            </p>
          </div>
        ) : (
          filteredTeachers.map((teacher) => {
            const statusBadge = getStatusBadge(teacher.status);
            return (
              <div
                key={teacher._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
              >
                {/* Teacher Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-lg" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{teacher.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Teacher Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaEnvelope className="text-blue-500 flex-shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaSchool className="text-green-500 flex-shrink-0" />
                    <span>{teacher.department}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaCalendarAlt className="text-purple-500 flex-shrink-0" />
                    <span>ID: {teacher.teacherId}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaCalendarAlt className="text-indigo-500 flex-shrink-0" />
                    <span>Academic Year: {teacher.year}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaBook className="text-pink-500 flex-shrink-0" />
                    <span>Subject: {teacher.subject}</span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaCalendarAlt className="text-orange-500 flex-shrink-0" />
                    <span>Joined: {new Date(teacher.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTeacherStatus(teacher._id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${teacher.status === "active"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                  >
                    {teacher.status === "active" ? (
                      <>
                        <FaBan size={14} />
                        Block
                      </>
                    ) : (
                      <>
                        <FaCheck size={14} />
                        Activate
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => deleteTeacher(teacher._id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-all duration-300 font-medium"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{teachers.length}</div>
            <div className="text-sm text-gray-600">Total Teachers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {teachers.filter(t => t.status === "active").length}
            </div>
            <div className="text-sm text-gray-600">Active Teachers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {teachers.filter(t => t.status === "blocked").length}
            </div>
            <div className="text-sm text-gray-600">Blocked Teachers</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageTeacher;
