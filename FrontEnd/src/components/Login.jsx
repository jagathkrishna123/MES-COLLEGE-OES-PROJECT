import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("teacher-login");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success, error, info
  const [departments, setDepartments] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  // Teacher Login State
  const [teacherLogin, setTeacherLogin] = useState({
    email: "",
    password: "",
  });

  // Teacher Signup State
  const [teacherSignup, setTeacherSignup] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    year: "",
    subject: "",
    teacherId: "",
  });

  // Admin Login State
  const [adminLogin, setAdminLogin] = useState({
    email: "",
    password: "",
  });


  // Handle input changes
  const handleTeacherLoginChange = (e) => {
    const { name, value } = e.target;
    setTeacherLogin({ ...teacherLogin, [name]: value });
  };

  const handleTeacherSignupChange = (e) => {
    const { name, value } = e.target;
    setTeacherSignup({ ...teacherSignup, [name]: value });
  };

  const handleAdminLoginChange = (e) => {
    const { name, value } = e.target;
    setAdminLogin({ ...adminLogin, [name]: value });
  };

  // Show message function
  const showMessage = (text, type = "info") => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 4000);
  };

  // Teacher Login Handler
  const handleTeacherLogin = async (e) => {
    e.preventDefault();

    if (!teacherLogin.email || !teacherLogin.password) {
      showMessage("❌ Please fill in all fields.", "error");
      return;
    }

    try {
      const res = await axios.post(
        "/loginTeacher",
        {
          email: teacherLogin.email,
          password: teacherLogin.password,
        },
        {
          withCredentials: true, // VERY IMPORTANT for cookies
        }
      );


      const teacherName =
        res?.data?.teacher?.name ||
        res?.data?.name ||
        res?.data?.teacherName;

      if (typeof teacherName === "string" && teacherName.trim()) {
        localStorage.setItem("teacherName", teacherName.trim());
      }
      const teacherDepartment = res?.data?.teacher?.department || res?.data?.department;
      if (teacherDepartment) {
        localStorage.setItem("teacherDepartment", teacherDepartment);
      }


      showMessage("✅ Login successful! Redirecting...", "success");

      setTimeout(() => {
        navigate("/teacher");
      }, 1500);

    } catch (error) {
      const message =
        error.response?.data?.message || "❌ Invalid email or password.";
      showMessage(message, "error");
    }
  };

  // Teacher Signup Handler


  const handleTeacherSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !teacherSignup.name ||
      !teacherSignup.email ||
      !teacherSignup.password ||
      !teacherSignup.confirmPassword ||
      !teacherSignup.department ||
      !teacherSignup.year ||
      !teacherSignup.subject ||
      !teacherSignup.teacherId
    ) {
      showMessage("❌ Please fill in all required fields.", "error");
      return;
    }

    if (teacherSignup.password !== teacherSignup.confirmPassword) {
      showMessage("❌ Passwords do not match.", "error");
      return;
    }

    if (teacherSignup.password.length < 6) {
      showMessage("❌ Password must be at least 6 characters long.", "error");
      return;
    }

    try {
      // API call
      await axios.post(
        "/teachersignup",
        {
          name: teacherSignup.name,
          email: teacherSignup.email,
          password: teacherSignup.password,
          confirmPassword: teacherSignup.confirmPassword,
          department: teacherSignup.department,
          year: teacherSignup.year,
          subject: teacherSignup.subject,
          teacherId: teacherSignup.teacherId,
        },
        {
          withCredentials: true, // important if backend sets cookies
        }
      );

      showMessage("✅ Registration successful! Please wait for admin approval before logging in.", "success");

      // Reset form
      setTeacherSignup({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        department: "",
        year: "",
        subject: "",
        teacherId: "",
      });

      // Switch to login tab
      setActiveTab("teacher-login");

    } catch (error) {
      const message =
        error.response?.data?.message || "❌ Registration failed.";
      showMessage(message, "error");
    }
  };


  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault()

    const { email, password } = adminLogin

    if (!email?.trim() || !password?.trim()) {
      showMessage('❌ Please fill in all fields.', 'error')
      return
    }

    try {
      showMessage('⏳ Logging in...', 'info')

      await axios.post(
        '/controllerlogin',
        {
          email: email.trim(),
          password
        },
        {
          withCredentials: true // 🔐 cookie-based auth
        }
      )

      showMessage('✅ Controller login successful! Redirecting...', 'success')

      setTimeout(() => {
        navigate('/controller')
      }, 1200)

    } catch (error) {
      console.error('Admin login error:', error)

      showMessage(
        error.response?.data?.message || '❌ Login failed. Please try again.',
        'error'
      )
    }
  }

  //Fetch Departments on server
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/getTeacherDepartment", {

        });
        console.log(res, "res");

        setDepartments(res.data?.departments || []);
      } catch (error) {
        console.error("Failed to load departments:", error);
      }
    };

    fetchDepartments();
  }, []);

  // Update available years when department changes
  useEffect(() => {
    if (teacherSignup.department) {
      const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
      if (selectedDept) {
        const years = Object.keys(selectedDept.years || {});
        setAvailableYears(years);
      } else {
        setAvailableYears([]);
      }
    } else {
      setAvailableYears([]);
    }
  }, [teacherSignup.department, departments]);

  // Update available subjects when department and year changes
  useEffect(() => {
    if (teacherSignup.department && teacherSignup.year) {
      const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
      if (selectedDept && selectedDept.years[teacherSignup.year]) {
        setAvailableSubjects(selectedDept.years[teacherSignup.year]);
      } else {
        setAvailableSubjects([]);
      }
    } else {
      setAvailableSubjects([]);
    }
  }, [teacherSignup.department, teacherSignup.year, departments]);

  // Check if already logged in
  useEffect(() => {
    const teacher = localStorage.getItem("teacher");
    const controller = localStorage.getItem("controller");

    if (teacher) {
      navigate("/teacher");
    } else if (controller) {
      navigate("/controller");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-out">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to OES
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Online Examination System
          </p>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-lg text-center font-medium ${messageType === "success"
            ? "bg-green-100 text-green-700 border border-green-300"
            : messageType === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
            }`}>
            {message}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("teacher-login")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "teacher-login"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Teacher Login
            </button>
            <button
              onClick={() => setActiveTab("teacher-signup")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "teacher-signup"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Teacher Signup
            </button>
            <button
              onClick={() => setActiveTab("admin-login")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "admin-login"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
                }`}
            >
              Controller Login
            </button>
          </div>
        </div>

        {/* Teacher Login Form */}
        {activeTab === "teacher-login" && (
          <form className="mt-8 space-y-6" onSubmit={handleTeacherLogin}>
            <div className="bg-white py-8 px-6 shadow-lg rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center">Teacher Login</h3>

              <div>
                <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  id="teacher-email"
                  name="email"
                  type="email"
                  required
                  value={teacherLogin.email}
                  onChange={handleTeacherLoginChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="teacher@example.com"
                />
              </div>

              <div>
                <label htmlFor="teacher-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="teacher-password"
                  name="password"
                  type="password"
                  required
                  value={teacherLogin.password}
                  onChange={handleTeacherLoginChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Teacher Signup Form */}
        {activeTab === "teacher-signup" && (
          <form className="mt-8 space-y-6" onSubmit={handleTeacherSignup}>
            <div className="bg-white py-8 px-6 shadow-lg rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center">Teacher Registration</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                  </label>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    required
                    value={teacherSignup.name}
                    onChange={handleTeacherSignupChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="signup-teacherId" className="block text-sm font-medium text-gray-700">
                    Teacher ID *
                  </label>
                  <input
                    id="signup-teacherId"
                    name="teacherId"
                    type="text"
                    required
                    value={teacherSignup.teacherId}
                    onChange={handleTeacherSignupChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="T001"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  value={teacherSignup.email}
                  onChange={handleTeacherSignupChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="teacher@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-department" className="block text-sm font-medium text-gray-700">
                    Department *
                  </label>
                  <select
                    id="signup-department"
                    name="department"
                    required
                    value={teacherSignup.department}
                    onChange={handleTeacherSignupChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="">Select Department</option>
                    {[...new Set(departments.map(dept => dept.departmentName))].map(
                      (departmentName) => (
                        <option key={departmentName} value={departmentName}>
                          {departmentName}
                        </option>
                      )
                    )}
                  </select>
                  {departments.length === 0 && (
                    <p className="mt-1 text-xs text-orange-600">
                      No departments available. Please contact the controller to create departments.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-year" className="block text-sm font-medium text-gray-700">
                    Academic Year *
                  </label>
                  <select
                    id="signup-year"
                    name="year"
                    required
                    value={teacherSignup.year}
                    onChange={handleTeacherSignupChange}
                    disabled={!teacherSignup.department}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {teacherSignup.department ? "Select Year" : "Select Department First"}
                    </option>
                    {departments
                      .filter(dept => dept.departmentName === teacherSignup.department)
                      .map(dept => (
                        <option key={dept._id} value={dept.year}>
                          {dept.year}
                        </option>
                      ))}
                  </select>
                  {teacherSignup.department && departments.filter(d => d.departmentName === teacherSignup.department).length === 0 && (
                    <p className="mt-1 text-xs text-orange-600">
                      No academic years available for this department.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="signup-subject" className="block text-sm font-medium text-gray-700">
                  Subject *
                </label>
                <select
                  id="signup-subject"
                  name="subject"
                  required
                  value={teacherSignup.subject}
                  onChange={handleTeacherSignupChange}
                  disabled={!teacherSignup.department || !teacherSignup.year}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {teacherSignup.department && teacherSignup.year ? "Select Subject" : "Select Department & Year First"}
                  </option>
                  {departments
                    .filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year)
                    .flatMap(dept => dept.subjects)
                    .map((subject, index) => (
                      <option key={index} value={subject}>
                        {subject}
                      </option>
                    ))}
                </select>
                {teacherSignup.department && teacherSignup.year && departments.filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year).flatMap(dept => dept.subjects).length === 0 && (
                  <p className="mt-1 text-xs text-orange-600">
                    No subjects available for this department and year.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    value={teacherSignup.password}
                    onChange={handleTeacherSignupChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password *
                  </label>
                  <input
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={teacherSignup.confirmPassword}
                    onChange={handleTeacherSignupChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
              >
                Register
              </button>
            </div>
          </form>
        )}

        {/* Admin Login Form */}
        {activeTab === "admin-login" && (
          <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
            <div className="bg-white py-8 px-6 shadow-lg rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-gray-900 text-center">Controller Login</h3>
              <p className="text-xs text-gray-500 text-center">
                Use credentials: admin@oes.com / admin123
              </p>

              <div>
                <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  value={adminLogin.email}
                  onChange={handleAdminLoginChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="admin@oes.com"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  value={adminLogin.password}
                  onChange={handleAdminLoginChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
              >
                Admin Login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
