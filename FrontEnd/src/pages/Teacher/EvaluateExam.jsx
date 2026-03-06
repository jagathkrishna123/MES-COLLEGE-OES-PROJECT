import React, { useState, useEffect } from "react";
import { getDynamicExams, updateExam } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { FaBook, FaClock, FaCheckCircle, FaUsers, FaFileAlt, FaUser, FaUpload, FaKey } from "react-icons/fa";

const EvaluateExam = () => {
  const navigate = useNavigate();
  const [examData, setExamData] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [teacher, setTeacher] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [enteredKey, setEnteredKey] = useState("");
  const [selectedExam, setSelectedExam] = useState(null);
  const [keyError, setKeyError] = useState("");

  const handleVerifyKey = async () => {
    if (enteredKey.toUpperCase() === selectedExam.examKey.toUpperCase()) {
      setShowKeyModal(false);
      setEnteredKey("");
      setKeyError("");

      // Navigate to evaluation page
      const freshData = await getDynamicExams();
      const currentExam = freshData.find(e => e._id === selectedExam._id);
      navigate(`/teacher/evaluation/${selectedExam._id}`, {
        state: { examData: currentExam }
      });
    } else {
      setKeyError("Invalid access key. Please try again.");
    }
  };

  useEffect(() => {
    // Load teacher information
    const storedTeacher = JSON.parse(localStorage.getItem("teacher"));
    if (storedTeacher) {
      setTeacher(storedTeacher);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const newData = await getDynamicExams();

      console.log(newData, "exam data");

      // Filter exams by teacher's department, year, and subject
      const filteredData = teacher
        ? newData.filter(exam => exam.department === teacher.department && exam.year === teacher.year && exam.subject === teacher.subject)
        : newData;
      setExamData(filteredData);
    };

    loadData();

    // // Reload data periodically to catch newly created exams
    // const interval = setInterval(() => {
    //   loadData();
    //   setRefreshTrigger(prev => prev + 1); // Force re-render
    // }, 1000);

    // return () => clearInterval(interval);
  }, [teacher]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
      {/* Key Verification Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-in zoom-in-95 duration-300">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-center text-white">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
                <FaKey className="text-white text-2xl" />
              </div>
              <h2 className="text-xl font-bold">Verification Required</h2>
              <p className="text-blue-50 text-sm opacity-90">Enter the access key to evaluate students</p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alpha-numeric Access Key
                </label>
                <input
                  type="text"
                  value={enteredKey}
                  onChange={(e) => {
                    setEnteredKey(e.target.value.toUpperCase());
                    setKeyError("");
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyKey()}
                  placeholder="e.g., A1B2C3"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-all text-center font-mono text-xl tracking-widest ${keyError ? "border-red-500 bg-red-50" : "border-gray-300"
                    }`}
                  autoFocus
                />
                {keyError && (
                  <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                    <span className="font-bold">!</span> {keyError}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowKeyModal(false);
                    setEnteredKey("");
                    setKeyError("");
                  }}
                  className="flex-1 py-3 px-4 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVerifyKey}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-md transition-all"
                >
                  Verify Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <FaFileAlt className="text-blue-600" />
          Evaluate Exams
        </h1>
        <p className="text-gray-600">
          Review and evaluate student answer sheets for {teacher ? `${teacher.subject} subject in ${teacher.department} department, ${teacher.year}` : 'assigned'} examinations.
        </p>
        {teacher && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            <FaUser className="text-blue-600" />
            {teacher.name} - {teacher.department} ({teacher.year}) - {teacher.subject}
          </div>
        )}
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-500">
              <FaFileAlt className="mx-auto h-16 w-16 mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No Exams Available</h3>
              <p>
                {teacher
                  ? `No exams found for ${teacher.subject} subject in ${teacher.department} department (${teacher.year}). Exams will appear here when created for your specific department, academic year, and subject.`
                  : 'Please log in as a teacher to view exams.'
                }
              </p>
              {!teacher && (
                <p className="text-sm text-gray-400 mt-2">Teacher information not found in localStorage.</p>
              )}
            </div>
          </div>
        ) : (
          examData.map((exam) => {
            const totalStudents = exam.students.length;
            const evaluatedStudents = exam.students.filter(s => s.status === "evaluated").length;
            const pendingStudents = totalStudents - evaluatedStudents;
            const percentage = totalStudents > 0 ? Math.round((evaluatedStudents / totalStudents) * 100) : 0;

            return (
              <div
                key={exam._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
              >
                {/* Exam Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">{exam.title}</h2>
                    <p className="text-sm text-gray-600">{exam.subject} - {exam.department}</p>
                    <p className="text-xs text-gray-500 mt-1">{exam.year}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${exam.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : exam.status === "submitted"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                    }`}>
                    {exam.status === "completed" ? "Published" : exam.status === "submitted" ? "Submitted" : "Active"}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaUsers className="text-blue-500" size={14} />
                      <span className="text-sm text-gray-600">Total</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaClock className="text-orange-500" size={14} />
                      <span className="text-sm text-gray-600">Pending</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{pendingStudents}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-600 mb-2">
                    <span>Evaluation Progress</span>
                    <span>{evaluatedStudents}/{totalStudents} Completed</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${percentage === 100 ? "bg-green-500" : "bg-blue-500"
                        }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{percentage}% Complete</p>
                </div>

                {/* Creation Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                  <FaClock size={12} />
                  <span>Created: {new Date(exam.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Action Button */}
                <button
                  onClick={async () => {
                    if (percentage === 100 && exam.status !== "submitted" && exam.status !== "completed") {
                      // Submit results to controller
                      const updatedExam = { ...exam, status: "submitted", submittedDate: new Date().toISOString() };
                      updateExam(updatedExam);
                      alert("Results submitted to exam controller for publishing!");
                      // Refresh the page to update the UI
                      window.location.reload();
                    } else if (exam.status !== "submitted" && exam.status !== "completed") {
                      // Prompt for key before navigating
                      setSelectedExam(exam);
                      setShowKeyModal(true);
                    }
                  }}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${exam.status === "completed"
                    ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                    : exam.status === "submitted"
                      ? "bg-yellow-100 text-yellow-700 cursor-not-allowed"
                      : percentage === 100
                        ? "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    }`}
                >
                  {exam.status === "completed" ? (
                    <>
                      <FaCheckCircle />
                      Results Published
                    </>
                  ) : exam.status === "submitted" ? (
                    <>
                      <FaClock />
                      Awaiting Publication
                    </>
                  ) : percentage === 100 ? (
                    <>
                      <FaUpload />
                      Submit Results
                    </>
                  ) : (
                    <>
                      <FaBook />
                      Evaluate Students
                    </>
                  )}
                </button>
              </div>
            );
          }))}
      </div>

      {/* Summary Stats */}
      {examData.length > 0 && (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{examData.length}</div>
              <div className="text-sm text-gray-600">Total Exams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {examData.filter(e => e.status === "active").length}
              </div>
              <div className="text-sm text-gray-600">Active Exams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {examData.filter(e => e.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed Exams</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {examData.reduce((total, exam) => total + exam.students.filter(s => s.status === "pending").length, 0)}
              </div>
              <div className="text-sm text-gray-600">Pending Evaluations</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EvaluateExam;
