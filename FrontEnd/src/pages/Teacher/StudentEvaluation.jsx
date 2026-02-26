import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDynamicExams, updateExam } from "../../constants/constants";
import { FaFileAlt, FaKey, FaArrowLeft, FaSave, FaEye, FaTimes, FaExpand, FaCompress, FaCheckCircle } from "react-icons/fa";
import { base64ToBlobUrl, revokeBlobUrls } from "../../utils/fileUtils";
import axios from "axios";
const StudentEvaluation = () => {
  const { subjectId, studentId } = useParams();


  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("questionPaper");
  const [marks, setMarks] = useState({});
  const [outOfMarks, setOutOfMarks] = useState({});
  const [totalMarks, setTotalMarks] = useState(0);
  const [totalPossibleMarks, setTotalPossibleMarks] = useState(0);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [examData, setExamData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // const [questionCount, setQuestionCount] = useState(10);
  const [questionCount, setQuestionCount] = useState(() => {
    const studentCount = location.state?.studentData?.questionCount;
    const lastUsedCount = localStorage.getItem("lastQuestionCount");
    return studentCount || (lastUsedCount ? parseInt(lastUsedCount) : 10);
  });

  // Persist questionCount preference
  useEffect(() => {
    localStorage.setItem("lastQuestionCount", questionCount);
  }, [questionCount]);

  // Persist outOfMarks structure to localStorage
  useEffect(() => {
    if (Object.keys(outOfMarks).length > 0) {
      localStorage.setItem("lastOutOfMarks", JSON.stringify(outOfMarks));
    }
  }, [outOfMarks]);

  const [blobUrls, setBlobUrls] = useState({}); // Track blob URLs for cleanup
  const [studentid, setStudentId] = useState()
  const [examid, setExamId] = useState()
  const [subjcet, setSubject] = useState("")



  console.log(blobUrls, "url");



  // Convert Base64 data to blob URLs
  const createBlobUrls = (examData) => {
    const studentFromState = location.state?.studentData;
    const studentId = studentFromState.studentId
    if (studentId) {
      setStudentId(studentId)
    }

    const examid = examData._id
    if (examid) {
      setExamId(examid)
    }

    const urls = {};
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


    // Question Paper
    if (examData?.questionPaper) {
      const filename = examData.questionPaper.split("\\").pop();
      urls.questionPaper = `${BASE_URL}/uploads/${filename}`;
    }

    // Answer Key
    if (examData?.answerKey) {
      const filename = examData.answerKey.split("\\").pop();
      urls.answerKey = `${BASE_URL}/uploads/${filename}`;
    }

    // Student files
    if (Array.isArray(examData?.students) && studentId) {
      const matchedStudent = examData.students.find(
        (student) => student.studentId === studentId
      );



      if (matchedStudent?.file) {
        const filename = matchedStudent.file.split("\\").pop();
        urls.student = {
          ...matchedStudent,
          fileUrl: `${BASE_URL}/uploads/${filename}`,
        };
      }
    }

    setBlobUrls(urls);
    return urls;
  };



  // Load exam data on mount and when params change
  useEffect(() => {
    // Only load exam data if we don't have exam from navigation state
    if (!location.state?.examData) {
      const loadData = async () => {
        const allExams = await getDynamicExams();
        console.log(allExams, "allexam 112");

        setExamData(allExams);
        setDataLoaded(true);
      };

      loadData();

      // Also load data after a delay to ensure any newly created exams are loaded
      const timeoutId = setTimeout(() => {
        const refreshedExams = getDynamicExams();
        if (refreshedExams.length !== examData.length) {
          setExamData(refreshedExams);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setDataLoaded(true);
    }
  }, [subjectId, studentId, location.state?.examData]);

  // Get exam data from navigation state - this should always be available
  const examFromState = location.state?.examData;
  // const exam = examFromState || examData.find(e => e.id === subjectId);
  const exam = examFromState || examData.find(e => e._id === subjectId);
  console.log(exam, "exam");
  useEffect(() => {
    if (exam) {
      setSubject(exam.subject);
    }
  }, [exam]);



  // If no exam from state, try to find it in loaded data
  const studentFromState = location.state?.studentData;


  const student = studentFromState || exam?.students?.find(s => s.studentId === studentId);


  useEffect(() => {
    if (student?.questionCount) {
      setQuestionCount(student.questionCount);
    }
  }, [student]);



  // Create blob URLs from Base64 data when exam and student are available
  useEffect(() => {
    if (exam && student && !Object.keys(blobUrls).length) {
      createBlobUrls(exam, student);
    }
  }, [exam, student]);


  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      // Clean up blob URLs to prevent memory leaks
      revokeBlobUrls(blobUrls.questionPaper, blobUrls.answerKey, blobUrls.answerSheet);
    };
  }, [blobUrls]);

  // If exam not found and data is loaded, try reloading data
  useEffect(() => {
    if (dataLoaded && !exam) {
      const refreshedData = getDynamicExams();
      setExamData(refreshedData);

      const refreshedExam = refreshedData.find(e => e.id === subjectId);
      if (refreshedExam) {
      } else {
      }
    }
  }, [dataLoaded, exam, subjectId]);

  // Loading state - show loading if no exam data available yet
  if (!dataLoaded && !exam) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam data...</p>
        </div>
      </div>
    );
  }

  // Exam not found - only show after data has loaded and no exam from state
  if (dataLoaded && !exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Exam Not Found</h2>
          <p className="text-gray-600">The requested exam could not be found.</p>
          <button
            onClick={() => navigate("/teacher")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Student not found
  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Not Found</h2>
          <p className="text-gray-600">The requested student evaluation could not be found.</p>
          <button
            onClick={() => navigate(`/teacher/evaluation/${subjectId}`, {
              state: { examData: exam }
            })}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Subject Evaluation
          </button>
        </div>
      </div>
    );
  }

  // Initialize marks and out-of marks for each question based on questionCount
  useEffect(() => {
    if (exam && student && Object.keys(marks).length === 0) {
      const initialMarks = {};
      const initialOutOfMarks = {};

      // Load saved scheme or fallback to localStorage, then default 10
      const savedOutOfMarks = student?.outOfMarksStructure
        ? (student.outOfMarksStructure instanceof Map
          ? Object.fromEntries(student.outOfMarksStructure)
          : student.outOfMarksStructure)
        : JSON.parse(localStorage.getItem("lastOutOfMarks") || "{}");

      const countToUse = student?.questionCount || questionCount;

      for (let i = 1; i <= countToUse; i++) {
        const qKey = `q${i}`;
        initialMarks[qKey] = 0;
        initialOutOfMarks[qKey] = savedOutOfMarks[qKey] !== undefined ? savedOutOfMarks[qKey] : 10;
      }
      setMarks(initialMarks);
      setOutOfMarks(initialOutOfMarks);

      // Sync questionCount if student has a saved one
      if (student?.questionCount && student.questionCount !== questionCount) {
        setQuestionCount(student.questionCount);
      }
    }
  }, [exam, student, questionCount, marks]);


  // Calculate totals using useMemo for reactive computation
  const { calculatedTotalMarks, calculatedTotalPossibleMarks } = useMemo(() => {
    let total = 0;
    let totalPossible = 0;

    for (let i = 1; i <= questionCount; i++) {
      const questionKey = `q${i}`;
      const markValue = parseFloat(marks[questionKey]) || 0;
      const outOfValue = parseFloat(outOfMarks[questionKey]) || 0;

      total += markValue;
      totalPossible += outOfValue;
    }

    // Fallback for evaluated students if calculation is 0 but student has saved marks
    if (student?.status === "evaluated" && total === 0 && totalPossible === 0) {
      return {
        calculatedTotalMarks: student.marks || 0,
        calculatedTotalPossibleMarks: student.outOfMarks || 0
      };
    }

    return {
      calculatedTotalMarks: total,
      calculatedTotalPossibleMarks: totalPossible
    };
  }, [marks, outOfMarks, questionCount, student]);

  // Update total marks state when calculations change
  useEffect(() => {
    setTotalMarks(calculatedTotalMarks);
    setTotalPossibleMarks(calculatedTotalPossibleMarks);
  }, [calculatedTotalMarks, calculatedTotalPossibleMarks]);

  // const handleMarkChange = (question, value) => {
  //   const newMarks = { ...marks, [question]: parseFloat(value) || 0 };
  //   setMarks(newMarks);
  // };

  const handleMarkChange = (question, value) => {
    const enteredMark = parseFloat(value) || 0;
    const maxMark = parseFloat(outOfMarks[question]) || 0;

    // Clamp value between 0 and maxMark
    const validMark = Math.min(Math.max(enteredMark, 0), maxMark);

    setMarks(prev => ({
      ...prev,
      [question]: validMark
    }));
  };

  // const handleOutOfMarksChange = (question, value) => {
  //   const newOutOfMarks = { ...outOfMarks, [question]: parseFloat(value) || 0 };
  //   setOutOfMarks(newOutOfMarks);
  // };

  const handleOutOfMarksChange = (question, value) => {
    const newOutOf = parseFloat(value) || 0;

    setOutOfMarks(prev => ({
      ...prev,
      [question]: newOutOf
    }));

    // Clamp existing mark if it's now greater than new outOf
    setMarks(prev => ({
      ...prev,
      [question]: Math.min(prev[question] || 0, newOutOf)
    }));
  };

  const handleSubmit = async (examId, studentId, subject) => {



    if (totalMarks > totalPossibleMarks) {
      alert(`Total marks cannot exceed ${totalPossibleMarks}!`);
      return;
    }

    setLoading(true);

    try {
      // 🔹 API call with credentials
      const response = await axios.post(
        "/evaluateExam", // change to your API
        {
          examId,          // or exam._id
          subject,
          studentId,
          marks: totalMarks,
          outOfMarks: totalPossibleMarks,
          comments,
          questionCount,
          outOfMarksStructure: outOfMarks // ✅ SAVE IT HERE
        },
        {
          withCredentials: true // ✅ IMPORTANT
        }
      );


      // 🔹 Update local exam data after success
      const updatedExam = {
        ...exam,
        totalMarks: totalPossibleMarks,
        students: exam.students.map(s =>
          s.studentId === studentId
            ? {
              ...s,
              status: "evaluated",
              marks: totalMarks,
              outOfMarks: totalPossibleMarks,
              questionCount,     // ✅ SAVE IT HERE
              outOfMarksStructure: outOfMarks, // ✅ AND HERE
              evaluationDate: new Date().toISOString()
            }
            : s
        )
      };

      updateExam(updatedExam);

      console.log("Evaluation submitted:", response.data);

      alert(
        `Evaluation submitted successfully!\n` +
        `Total Marks: ${totalMarks}/${totalPossibleMarks}\n\n` +
        `Note: Results will be published by the exam controller.`
      );

      //       navigate(`/teacher/evaluation/${subjectId}`, {
      //   state: { examData: exam }
      // });;

      navigate(`/teacher/evaluation/${subjectId}`, {
        state: { examData: updatedExam }
      });

    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
        "Failed to submit evaluation. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
      <div className="max-w-[1440px] mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (subjectId) {
                    navigate(`/teacher/evaluation/${subjectId}`, {
                      state: { examData: exam }
                    });;
                  } else {
                    // Fallback: try to navigate to teacher dashboard
                    navigate("/teacher");
                  }
                }}
                className="back-btn flex items-center gap-2 px-5 py-2.5 text-sm md:text-base rounded-lg shadow-md border border-gray-300"
              >
                <FaArrowLeft className="arrow-icon" />
                Back to Subject
              </button>
              <div>
                <h1 className="text-[15px] sm:text-md md:text-3xl font-bold text-gray-900">{exam.subject}</h1>
                <p className="text-gray-600 text-[13px] md:text-[16px]">{exam.title}</p>
              </div>
            </div>
            <div className="text-right">
              <h3 className="text-md md:text-lg font-semibold text-gray-900">{student.studentName}</h3>
              <p className="text-gray-600 text-[13px] md:text-[15px]">Roll: {student.rollNo}</p>
            </div>
          </div>
        </div>

        {/* Question Count Selector */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Evaluation Settings</h3>
              <p className="text-sm text-gray-600">Set the number of questions to evaluate</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Number of Questions:</label>
              <select
                value={questionCount}
                onChange={(e) => {
                  const newCount = parseInt(e.target.value);
                  setQuestionCount(newCount);

                  const newMarks = {};
                  const newOutOfMarks = {};
                  const lastUsedOutOfMarks = JSON.parse(localStorage.getItem("lastOutOfMarks") || "{}");

                  for (let i = 1; i <= newCount; i++) {
                    const qKey = `q${i}`;
                    newMarks[qKey] = marks[qKey] || 0;
                    newOutOfMarks[qKey] =
                      student?.outOfMarksStructure?.[qKey] ??
                      lastUsedOutOfMarks?.[qKey] ??
                      10;
                  }

                  setMarks(newMarks);
                  setOutOfMarks(newOutOfMarks);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>



        <div className={`grid gap-6 transition-all duration-500 ease-in-out ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>

          {/* Left Panel - Question Paper & Answer Key */}
          {!isFullscreen && (
            <div className="space-y-6 transform transition-all duration-500 ease-in-out opacity-100 translate-x-0"
              style={{
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isFullscreen ? 'translateX(-100%)' : 'translateX(0)',
                opacity: isFullscreen ? 0 : 1
              }}>

              {/* Tab Navigation */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 transform transition-all duration-300 ease-in-out hover:shadow-md">
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("questionPaper")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === "questionPaper"
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    <FaFileAlt className="inline mr-2" />
                    Question Paper
                  </button>
                  <button
                    onClick={() => setActiveTab("answerKey")}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeTab === "answerKey"
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                      }`}
                  >
                    <FaKey className="inline mr-2" />
                    Answer Key
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "questionPaper" ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <FaFileAlt className="text-blue-600 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-900">Question Paper</h3>
                      </div>

                      {/* Question Paper PDF Display */}
                      <div className="bg-gray-50 p-2 rounded-lg border border-gray-300">
                        <h4 className="font-semibold text-gray-900 mb-4">{exam.subject} - Question Paper</h4>

                        <div className="w-full h-[500px] border border-gray-300 rounded-lg overflow-hidden">
                          {blobUrls.questionPaper ? (
                            (exam.questionPaper && exam.questionPaper.includes('pdf')) ? (
                              <iframe
                                src={blobUrls.questionPaper}
                                className="w-full h-full"
                                title={`${exam.subject} - Question Paper`}
                                style={{ border: 'none' }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                                <div className="text-center">
                                  <FaFileAlt className="mx-auto h-16 w-16 mb-4 opacity-50" />
                                  <p>Question Paper uploaded</p>
                                  <p className="text-sm mt-2">Type: {exam.questionPaper || 'Unknown'}</p>
                                  <p className="text-xs mt-1">Only PDF files can be displayed in browser</p>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
                              <div className="text-center">
                                <FaFileAlt className="mx-auto h-16 w-16 mb-4 opacity-50" />
                                <p>Question Paper: Not available</p>
                                <p className="text-sm mt-2">File display not available</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-center text-gray-500 text-sm mt-4">
                          Question Paper - {exam.subject}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <FaKey className="text-green-600 text-xl" />
                        <h3 className="text-lg font-semibold text-gray-900">Answer Key</h3>
                      </div>

                      {/* Answer Key PDF Display */}
                      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-gray-900 mb-4">Answer Key - {exam.subject}</h4>

                        <div className="w-full h-[500px] border rounded-lg overflow-hidden">
                          {blobUrls.answerKey ? (
                            (exam.answerKey && exam.answerKey.includes('pdf')) ? (
                              <iframe
                                src={blobUrls.answerKey}
                                className="w-full h-full"
                                title={`${exam.subject} - Answer Key`}
                                style={{ border: 'none' }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-green-50 text-gray-500">
                                <div className="text-center">
                                  <FaKey className="mx-auto h-16 w-16 mb-4 opacity-50" />
                                  <p>Answer Key uploaded</p>
                                  <p className="text-sm mt-2">Type: {exam.answerKey || 'Unknown'}</p>
                                  <p className="text-xs mt-1">Only PDF files can be displayed in browser</p>
                                </div>
                              </div>
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-green-50 text-gray-500">
                              <div className="text-center">
                                <FaKey className="mx-auto h-16 w-16 mb-4 opacity-50" />
                                <p>Answer Key: Not available</p>
                                <p className="text-sm mt-2">File display not available</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-center text-gray-500 text-sm mt-4">
                          Answer Key - {exam.subject}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Panel - Student Answer Sheet */}
          <div className="space-y-6 transform transition-all duration-500 ease-in-out"
            style={{
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isFullscreen ? 'translateX(0) scale(105%)' : 'translateX(0) scale(100%)',
              opacity: 1
            }}>

            {/* Student Answer Sheet */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaEye className="text-purple-600 text-xl" />
                    <h3 className="text-lg font-semibold text-gray-900">Student Answer Sheetxx</h3>
                  </div>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                  >
                    <span className={`transition-transform duration-300 ${isFullscreen ? 'rotate-180' : 'rotate-0'}`}>
                      {isFullscreen ? <FaCompress /> : <FaExpand />}
                    </span>
                    <span className="text-sm font-medium transition-all duration-300">
                      {isFullscreen ? "Minimize" : "Fullscreen"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Student Answer Sheet PDF Display */}
                <div className="w-full h-[600px] border rounded-lg overflow-hidden mt-6">
                  {blobUrls.student ? (
                    (student.
                      file
                      && student.
                        file
                        .includes('pdf')) ? (
                      <iframe
                        src={blobUrls.student.fileUrl}
                        className="w-full h-full"
                        title={`${student.studentName} - Answer Sheet`}
                        style={{ border: 'none' }}
                      />
                    ) : (student.file && student.
                      file
                      .includes('pdf')) ? (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50">
                        <img
                          src={blobUrls.student.fileUrl}
                          alt={`${student.studentName} - Answer Sheet`}
                          className="max-w-full max-h-full object-contain"
                          style={{ width: 'auto', height: 'auto' }}
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-50 text-gray-500">
                        <div className="text-center">
                          <FaFileAlt className="mx-auto h-16 w-16 mb-4 opacity-50" />
                          <p>Answer Sheet uploaded</p>
                          <p className="text-sm mt-2">Type: {student.file || 'Unknown'}</p>
                          <p className="text-xs mt-1">File type not supported for display</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-gray-500">
                      <div className="text-center">
                        <FaFileAlt className="mx-auto h-16 w-16 mb-4 opacity-50" />
                        <p>Answer Sheet: Not available</p>
                        <p className="text-sm mt-2">File display not available</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


          </div>
        </div>
        {/* Question-wise Evaluation - Compact Design */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 transform transition-all duration-300 ease-in-out hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-blue-600 text-lg" />
              <h3 className="text-lg font-semibold text-gray-900">Question Evaluation</h3>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-blue-600">{totalMarks}/{totalPossibleMarks}</div>
              <div className="text-xs text-gray-600">Total Score</div>
            </div>
          </div>

          <div className="grid gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: questionCount }, (_, i) => i + 1).map((q) => (
              <div key={q} className="border border-gray-200 rounded-md p-3 hover:border-blue-300 hover:shadow-sm transition-all duration-200 ease-in-out hover:scale-[1.02] transform">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                      {q}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Q{q}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      max={outOfMarks[`q${q}`] || 10}
                      value={marks[`q${q}`] || 0}
                      onChange={(e) => handleMarkChange(`q${q}`, e.target.value)}
                      className="w-10 px-1 py-1 border border-gray-300 rounded text-center text-xs font-semibold focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                    <span className="text-gray-400 text-xs">/</span>
                    <select
                      value={outOfMarks[`q${q}`] || 10}
                      onChange={(e) => handleOutOfMarksChange(`q${q}`, e.target.value)}
                      className="w-12 px-1 py-1 border border-gray-300 rounded text-center text-xs bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                      <option value={8}>8</option>
                      <option value={10}>10</option>
                      <option value={15}>15</option>
                      <option value={20}>20</option>
                      <option value={25}>25</option>
                    </select>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${outOfMarks[`q${q}`] ? ((marks[`q${q}`] || 0) / outOfMarks[`q${q}`]) * 100 : 0}%`
                    }}
                  ></div>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  {(marks[`q${q}`] || 0)}/{outOfMarks[`q${q}`] || 10}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Evaluation Summary & Comments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transform transition-all duration-300 ease-in-out hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluation Summary</h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">Total Marks</span>
              <span className="text-xl font-bold text-blue-600">{totalMarks}/{totalPossibleMarks}</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Add any comments about the student's performance..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmit(examid, studentid, subjcet)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Submit Evaluation
                  </>
                )}
              </button>

              <button
                onClick={() => navigate(`/teacher/evaluation/${subjectId}`, {
                  state: { examData: exam }
                })}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentEvaluation;
