import React, { useState, useEffect } from 'react'
import { getDynamicExams } from '../../constants/constants'
import axios from 'axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  FaBook,
  FaTimes,
  FaUsers,
  FaCheckCircle,
  FaEye,
  FaDownload,
  FaFileAlt,
  FaSchool,
  FaCalendarAlt,
  FaChartBar,
  FaUpload,
  FaEdit,
  FaSearch,
  FaFilter
} from 'react-icons/fa'

const ManageResults = () => {
  const [exams, setExams] = useState([])
  const [completedExams, setCompletedExams] = useState([])
  const [filteredExams, setFilteredExams] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState({
    department: "all",
    year: "all",
    published: "all"
  })
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState("")
  const [lastExamCount, setLastExamCount] = useState(0)
  const [selectedExam, setSelectedExam] = useState(null)

  console.log(exams, "exams1223");
  console.log(completedExams, "cople");


  // Load exams and published status on mount and periodically refresh
  useEffect(() => {
    loadExams()

    // Set up periodic refresh to check for newly submitted results
    // const interval = setInterval(() => {
    //   loadExams()
    // }, 3000) // Check every 3 seconds


  }, [])

  const loadExams = async () => {
    const allExams = await getDynamicExams()


    setExams(allExams)

    // Filter exams that are submitted by teachers (ready for controller approval) or already completed (published)
    const submittedOrCompleted = allExams.filter(exam => {
      const students = exam.students || []
      console.log(students, "stu");

      if (students.length === 0) return false
      // Must have all students evaluated AND status should be "submitted" or "completed"
      return students.every(student => student.status === "evaluated") && (exam.status === "submitted" || exam.status === "completed")
    }).map(exam => ({
      ...exam,
      isPublished: exam.status === "completed"
    }))

    const pendingReview = submittedOrCompleted.filter(e => !e.isPublished)

    // Check if we have new submitted exams
    if (pendingReview.length > lastExamCount && lastExamCount > 0) {
      showMessage(`📬 New exam results submitted for review! (${pendingReview.length} total pending)`, "info")
    }
    setLastExamCount(pendingReview.length)

    // Load published status from localStorage


    // Add published status to submitted exams


    setCompletedExams(submittedOrCompleted)
  }

  // Filter exams whenever search or filters change
  useEffect(() => {
    let filtered = [...completedExams]

    // Filter by department
    if (filters.department !== "all") {
      filtered = filtered.filter(exam => exam.department === filters.department)
    }

    // Filter by year
    if (filters.year !== "all") {
      filtered = filtered.filter(exam => exam.year === filters.year)
    }

    // Filter by published status
    if (filters.published !== "all") {
      const isPublished = filters.published === "published"
      filtered = filtered.filter(exam => exam.isPublished === isPublished)
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(exam =>
        exam.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.department?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredExams(filtered)
  }, [completedExams, searchTerm, filters])

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value })
  }

  const showMessage = (text, type = "success") => {
    setMessage(text)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 4000)
  }

  const handlePublish = async (examId) => {


    const confirmed = window.confirm(
      "Are you sure you want to publish these results? Once published, results will be visible to students."
    );

    if (!confirmed) return;

    try {
      const response = await axios.put(
        `/publishexam/${examId}`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response, "rse");

      const updatedExam = response.data.data;

      // Update local state
      setCompletedExams((prev) =>
        prev.map((exam) =>
          exam._id === examId
            ? {
              ...exam,
              status: "completed",
              isPublished: true,
              publishedDate: updatedExam.publishedDate,
            }
            : exam
        )
      );

      showMessage(
        "✅ Results published successfully! Students can now view their results.",
        "success"
      );

      setRefreshKey(prev => prev + 1);

    } catch (error) {
      console.error("Publish exam error:", error);

      const message =
        error.response?.data?.message ||
        "Failed to publish results. Please try again.";

      showMessage(message, "error");
    }
  };

  const handleUnpublish = async (examId) => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish these results? Students will no longer be able to view them."
    );

    if (!confirmed) return;

    try {
      const response = await axios.put(
        `/unpublishexam/${examId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Update local state
      setCompletedExams((prev) =>
        prev.map((exam) =>
          exam._id === examId ? {
            ...exam,
            status: "submitted",
            isPublished: false,
          }
            : exam
        )
      );

      showMessage("✅ Results unpublished successfully.", "success");
      setRefreshKey((prev) => prev + 1);

    } catch (error) {
      console.error("Unpublish exam error:", error);
      const message =
        error.response?.data?.message ||
        "Failed to unpublish results. Please try again.";
      showMessage(message, "error");
    }
  };


  const handleViewResults = (exam) => {
    setSelectedExam(exam)
  }

  const closeModal = () => {
    setSelectedExam(null)
  }

  const handleDownloadResults = (exam) => {
    try {
      const doc = new jsPDF()

      // Title
      doc.setFontSize(18)
      doc.text(`Exam Results: ${exam.subject}`, 14, 22)

      // Details
      doc.setFontSize(11)
      doc.setTextColor(100)
      doc.text(`Title: ${exam.title}`, 14, 30)
      doc.text(`Department: ${exam.department} | Year: ${exam.year}`, 14, 36)
      doc.text(`Date: ${new Date(exam.createdAt).toLocaleDateString()}`, 14, 42)

      // Table
      const tableColumn = ["Roll No", "Student Name", "Status", "Marks"]
      const tableRows = []

      const students = exam.students || []
      students.forEach(student => {
        const marks = student.marks !== undefined ? student.marks : (student.subjects && student.subjects[0] ? student.subjects[0].marks : "N/A");
        const studentData = [
          student.rollNo || "N/A",
          student.name || "N/A",
          student.status || "N/A",
          marks
        ];
        tableRows.push(studentData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [37, 99, 235], textColor: 255 } // Blue header
      });

      const fileName = `${exam.subject.replace(/\\s+/g, '_')}_Results.pdf`
      doc.save(fileName)
      showMessage(`Downloaded results for ${exam.subject}`, "success")
    } catch (error) {
      console.error("Error generating PDF:", error)
      showMessage("Failed to generate PDF.", "error")
    }
  }

  // Get unique departments and years for filters
  const uniqueDepartments = [...new Set(completedExams.map(e => e.department))].filter(Boolean)
  const uniqueYears = [...new Set(completedExams.map(e => e.year))].filter(Boolean)

  // Calculate statistics
  const totalCompleted = exams.filter(exam => {
    const students = exam.students || []
    return students.length > 0 && students.every(s => s.status === "evaluated") && (exam.status === "submitted" || exam.status === "completed")
  }).length
  const publishedCount = exams.filter(e => e.status === "completed").length
  const unpublishedCount = exams.filter(e => e.status === "submitted").length
  const totalStudents = exams.reduce((sum, exam) => sum + (exam.students?.length || 0), 0)

  // Calculate average marks for an exam
  // const calculateAverageMarks = (exam) => {
  //   const students = exam.students || []
  //   const evaluatedStudents = students.filter(s => s.status === "evaluated" && s.marks !== undefined)
  //   if (evaluatedStudents.length === 0) return 0
  //   const sum = evaluatedStudents.reduce((acc, s) => acc + (s.marks || 0), 0)
  //   return sum / evaluatedStudents.length
  // }
  const calculateAverageMarks = (exam) => {
    const students = exam.students || [];

    const evaluatedStudents = students.filter(
      (s) => s.status === "evaluated"
    );

    if (evaluatedStudents.length === 0) return 0;

    const sum = evaluatedStudents.reduce((acc, s) => {
      const marks =
        s.marks !== undefined
          ? s.marks
          : s.subjects?.[0]?.marks ?? 0;

      return acc + Number(marks);
    }, 0);

    return sum / evaluatedStudents.length;
  };

  return (
    <div key={refreshKey} className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 font-out">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaBook className="text-blue-600" />
            Manage Results
          </h1>
          <p className="text-gray-600">
            View and manage completed evaluations. Publish results to make them visible to students.
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg text-center font-medium ${messageType === "success"
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
            }`}>
            {message}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Evaluations</p>
                <p className="text-3xl font-bold text-gray-900">{totalCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCheckCircle className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Published Results</p>
                <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaUpload className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Unpublished Results</p>
                <p className="text-3xl font-bold text-yellow-600">{unpublishedCount}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <FaFileAlt className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students Evaluated</p>
                <p className="text-3xl font-bold text-purple-600">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters & Search</h2>
            </div>
            <button
              onClick={() => loadExams()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Refresh results"
            >
              <FaSearch className="text-sm" />
              Refresh
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Subjects
            </label>
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by exam title, subject, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Filter Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                value={filters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="all">All Departments</option>
                {uniqueDepartments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="all">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Publication Status
              </label>
              <select
                value={filters.published}
                onChange={(e) => handleFilterChange("published", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              >
                <option value="all">All Results</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Completed Exams List */}
        {filteredExams.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaBook className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {completedExams.length === 0
                ? "No Completed Evaluations"
                : "No Results Match Your Filters"}
            </h3>
            <p className="text-gray-600">
              {completedExams.length === 0
                ? "No subjects have completed evaluations yet. Results will appear here once all students are evaluated."
                : "Try adjusting your search criteria or filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExams.map((exam) => {
              const students = exam.students || []
              const evaluatedCount = students.filter(s => s.status === "evaluated").length
              const averageMarks = calculateAverageMarks(exam)

              return (
                <div
                  key={exam.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${exam.isPublished
                    ? "border-green-300"
                    : "border-gray-200 hover:border-blue-300"
                    }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                            <FaBook className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{exam.subject}</h3>
                            <p className="text-sm text-gray-500">{exam.title}</p>
                          </div>
                        </div>
                      </div>
                      {exam.isPublished && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          <FaCheckCircle size={12} />
                          Published
                        </span>
                      )}
                    </div>

                    {/* Exam Details */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaSchool className="text-green-500 flex-shrink-0" />
                        <span><strong>Department:</strong> {exam.department} | {exam.year}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaUsers className="text-blue-500 flex-shrink-0" />
                        <span><strong>Students Evaluated:</strong> {evaluatedCount} / {students.length}</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaChartBar className="text-purple-500 flex-shrink-0" />
                        <span><strong>Average Marks:</strong> {averageMarks.toFixed(1)} / 100</span>
                      </div>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <FaCalendarAlt className="text-orange-500 flex-shrink-0" />
                        <span><strong>Created:</strong> {new Date(exam.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleViewResults(exam)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-300 font-medium text-sm"
                      >
                        <FaEye size={14} />
                        View Results
                      </button>

                      <button
                        onClick={() => handleDownloadResults(exam)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 font-medium text-sm"
                      >
                        <FaDownload size={14} />
                        Download
                      </button>

                      {exam.isPublished ? (
                        <button
                          onClick={() => handleUnpublish(exam._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-all duration-300 font-medium text-sm mt-2"
                        >
                          <FaEdit size={14} />
                          Unpublish Results
                        </button>
                      ) : (
                        <button
                          onClick={() => handlePublish(exam._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300 font-medium text-sm mt-2 shadow-md hover:shadow-lg"
                        >
                          <FaUpload size={14} />
                          Publish Results
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Results Modal */}
        {selectedExam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedExam.subject} Results</h2>
                  <p className="text-gray-500 mt-1 font-medium">{selectedExam.department} • {selectedExam.year}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
                >
                  <FaTimes size={22} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
                <div className="mb-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                    <p className="text-sm text-gray-500 font-medium mb-1">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedExam.students?.length || 0}</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm flex flex-col">
                    <p className="text-sm text-green-600 font-medium mb-1">Evaluated</p>
                    <p className="text-2xl font-bold text-green-700">
                      {(selectedExam.students || []).filter(s => s.status === "evaluated").length}
                    </p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm flex flex-col">
                    <p className="text-sm text-blue-600 font-medium mb-1">Average Marks</p>
                    <p className="text-2xl font-bold text-blue-700">{calculateAverageMarks(selectedExam).toFixed(1)}</p>
                  </div>
                  <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm flex flex-col">
                    <p className="text-sm text-orange-600 font-medium mb-1">Status</p>
                    <p className="text-2xl font-bold text-orange-700 capitalize">{selectedExam.isPublished ? 'Published' : 'Unpublished'}</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/80 text-gray-700 border-b border-gray-200">
                          <th className="px-5 py-4 font-semibold text-sm">Roll No</th>
                          <th className="px-5 py-4 font-semibold text-sm">Name</th>
                          <th className="px-5 py-4 font-semibold text-sm">Status</th>
                          <th className="px-5 py-4 font-semibold text-sm">Marks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {(selectedExam.students || []).map((student, idx) => {
                          const marks = student.marks !== undefined ? student.marks : (student.subjects && student.subjects[0] ? student.subjects[0].marks : "-");
                          return (
                            <tr key={idx} className="hover:bg-blue-50/50 transition-colors">
                              <td className="px-5 py-3.5 text-sm text-gray-600 font-medium">{student.rollNo || "N/A"}</td>
                              <td className="px-5 py-3.5 text-sm font-semibold text-gray-900">{student.name || "N/A"}</td>
                              <td className="px-5 py-3.5 text-sm">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${student.status === 'evaluated' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {student.status === 'evaluated' ? 'Evaluated' : 'Pending'}
                                </span>
                              </td>
                              <td className="px-5 py-3.5 text-sm font-bold text-gray-900">
                                {marks}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                  {(selectedExam.students || []).length === 0 && (
                    <div className="p-10 text-center flex flex-col items-center justify-center">
                      <FaUsers className="text-gray-300 text-4xl mb-3" />
                      <p className="text-gray-500 font-medium">No students found for this exam.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3 z-10 shrink-0">
                <button
                  onClick={closeModal}
                  className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors font-semibold shadow-sm"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownloadResults(selectedExam)}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold shadow-sm shadow-blue-600/20"
                >
                  <FaDownload size={14} />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageResults
