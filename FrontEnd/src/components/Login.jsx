// // // import React, { useState, useEffect } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import axios from "axios";
// // // import MESLOGO from "../assets/MES_logop.png"

// // // const Login = () => {
// // //   const navigate = useNavigate();
// // //   const [activeTab, setActiveTab] = useState("teacher-login");
// // //   const [message, setMessage] = useState("");
// // //   const [messageType, setMessageType] = useState(""); // success, error, info
// // //   const [departments, setDepartments] = useState([]);
// // //   const [availableSubjects, setAvailableSubjects] = useState([]);
// // //   const [availableYears, setAvailableYears] = useState([]);

// // //   // Teacher Login State
// // //   const [teacherLogin, setTeacherLogin] = useState({
// // //     email: "",
// // //     password: "",
// // //   });

// // //   // Teacher Signup State
// // //   const [teacherSignup, setTeacherSignup] = useState({
// // //     name: "",
// // //     email: "",
// // //     password: "",
// // //     confirmPassword: "",
// // //     department: "",
// // //     year: "",
// // //     subject: "",
// // //     teacherId: "",
// // //   });

// // //   // Admin Login State
// // //   const [adminLogin, setAdminLogin] = useState({
// // //     email: "",
// // //     password: "",
// // //   });


// // //   // Handle input changes
// // //   const handleTeacherLoginChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setTeacherLogin({ ...teacherLogin, [name]: value });
// // //   };

// // //   const handleTeacherSignupChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setTeacherSignup({ ...teacherSignup, [name]: value });
// // //   };

// // //   const handleAdminLoginChange = (e) => {
// // //     const { name, value } = e.target;
// // //     setAdminLogin({ ...adminLogin, [name]: value });
// // //   };

// // //   // Show message function
// // //   const showMessage = (text, type = "info") => {
// // //     setMessage(text);
// // //     setMessageType(type);
// // //     setTimeout(() => {
// // //       setMessage("");
// // //       setMessageType("");
// // //     }, 4000);
// // //   };

// // //   // Teacher Login Handler
// // //   const handleTeacherLogin = async (e) => {
// // //     e.preventDefault();

// // //     if (!teacherLogin.email || !teacherLogin.password) {
// // //       showMessage("❌ Please fill in all fields.", "error");
// // //       return;
// // //     }

// // //     try {
// // //       const res = await axios.post(
// // //         "/loginTeacher",
// // //         {
// // //           email: teacherLogin.email,
// // //           password: teacherLogin.password,
// // //         },
// // //         {
// // //           withCredentials: true, // VERY IMPORTANT for cookies
// // //         }
// // //       );


// // //       const teacherName =
// // //         res?.data?.teacher?.name ||
// // //         res?.data?.name ||
// // //         res?.data?.teacherName;

// // //       if (typeof teacherName === "string" && teacherName.trim()) {
// // //         localStorage.setItem("teacherName", teacherName.trim());
// // //       }
// // //       const teacherDepartment = res?.data?.teacher?.department || res?.data?.department;
// // //       if (teacherDepartment) {
// // //         localStorage.setItem("teacherDepartment", teacherDepartment);
// // //       }


// // //       showMessage("✅ Login successful! Redirecting...", "success");

// // //       setTimeout(() => {
// // //         navigate("/teacher");
// // //       }, 1500);

// // //     } catch (error) {
// // //       const message =
// // //         error.response?.data?.message || "❌ Invalid email or password.";
// // //       showMessage(message, "error");
// // //     }
// // //   };

// // //   // Teacher Signup Handler


// // //   const handleTeacherSignup = async (e) => {
// // //     e.preventDefault();

// // //     // Validation
// // //     if (
// // //       !teacherSignup.name ||
// // //       !teacherSignup.email ||
// // //       !teacherSignup.password ||
// // //       !teacherSignup.confirmPassword ||
// // //       !teacherSignup.department ||
// // //       !teacherSignup.year ||
// // //       !teacherSignup.subject ||
// // //       !teacherSignup.teacherId
// // //     ) {
// // //       showMessage("❌ Please fill in all required fields.", "error");
// // //       return;
// // //     }

// // //     if (teacherSignup.password !== teacherSignup.confirmPassword) {
// // //       showMessage("❌ Passwords do not match.", "error");
// // //       return;
// // //     }

// // //     if (teacherSignup.password.length < 6) {
// // //       showMessage("❌ Password must be at least 6 characters long.", "error");
// // //       return;
// // //     }

// // //     try {
// // //       // API call
// // //       await axios.post(
// // //         "/teachersignup",
// // //         {
// // //           name: teacherSignup.name,
// // //           email: teacherSignup.email,
// // //           password: teacherSignup.password,
// // //           confirmPassword: teacherSignup.confirmPassword,
// // //           department: teacherSignup.department,
// // //           year: teacherSignup.year,
// // //           subject: teacherSignup.subject,
// // //           teacherId: teacherSignup.teacherId,
// // //         },
// // //         {
// // //           withCredentials: true, // important if backend sets cookies
// // //         }
// // //       );

// // //       showMessage("✅ Registration successful! Please wait for admin approval before logging in.", "success");

// // //       // Reset form
// // //       setTeacherSignup({
// // //         name: "",
// // //         email: "",
// // //         password: "",
// // //         confirmPassword: "",
// // //         department: "",
// // //         year: "",
// // //         subject: "",
// // //         teacherId: "",
// // //       });

// // //       // Switch to login tab
// // //       setActiveTab("teacher-login");

// // //     } catch (error) {
// // //       const message =
// // //         error.response?.data?.message || "❌ Registration failed.";
// // //       showMessage(message, "error");
// // //     }
// // //   };


// // //   // Admin Login Handler
// // //   const handleAdminLogin = async (e) => {
// // //     e.preventDefault()

// // //     const { email, password } = adminLogin

// // //     if (!email?.trim() || !password?.trim()) {
// // //       showMessage('❌ Please fill in all fields.', 'error')
// // //       return
// // //     }

// // //     try {
// // //       showMessage('⏳ Logging in...', 'info')

// // //       await axios.post(
// // //         '/controllerlogin',
// // //         {
// // //           email: email.trim(),
// // //           password
// // //         },
// // //         {
// // //           withCredentials: true // 🔐 cookie-based auth
// // //         }
// // //       )

// // //       showMessage('✅ Controller login successful! Redirecting...', 'success')

// // //       setTimeout(() => {
// // //         navigate('/controller')
// // //       }, 1200)

// // //     } catch (error) {
// // //       console.error('Admin login error:', error)

// // //       showMessage(
// // //         error.response?.data?.message || '❌ Login failed. Please try again.',
// // //         'error'
// // //       )
// // //     }
// // //   }

// // //   //Fetch Departments on server
// // //   useEffect(() => {
// // //     const fetchDepartments = async () => {
// // //       try {
// // //         const res = await axios.get("/getTeacherDepartment", {

// // //         });
// // //         console.log(res, "res");

// // //         setDepartments(res.data?.departments || []);
// // //       } catch (error) {
// // //         console.error("Failed to load departments:", error);
// // //       }
// // //     };

// // //     fetchDepartments();
// // //   }, []);

// // //   // Update available years when department changes
// // //   useEffect(() => {
// // //     if (teacherSignup.department) {
// // //       const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
// // //       if (selectedDept) {
// // //         const years = Object.keys(selectedDept.years || {});
// // //         setAvailableYears(years);
// // //       } else {
// // //         setAvailableYears([]);
// // //       }
// // //     } else {
// // //       setAvailableYears([]);
// // //     }
// // //   }, [teacherSignup.department, departments]);

// // //   // Update available subjects when department and year changes
// // //   useEffect(() => {
// // //     if (teacherSignup.department && teacherSignup.year) {
// // //       const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
// // //       if (selectedDept && selectedDept.years[teacherSignup.year]) {
// // //         setAvailableSubjects(selectedDept.years[teacherSignup.year]);
// // //       } else {
// // //         setAvailableSubjects([]);
// // //       }
// // //     } else {
// // //       setAvailableSubjects([]);
// // //     }
// // //   }, [teacherSignup.department, teacherSignup.year, departments]);

// // //   // Check if already logged in
// // //   useEffect(() => {
// // //     const teacher = localStorage.getItem("teacher");
// // //     const controller = localStorage.getItem("controller");

// // //     if (teacher) {
// // //       navigate("/teacher");
// // //     } else if (controller) {
// // //       navigate("/controller");
// // //     }
// // //   }, [navigate]);

// // //   return (
// // //     <div className="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-out">
// // //       <div
// // //   className="absolute inset-0 flex items-center justify-center pointer-events-none"
// // //   style={{
// // //     backgroundImage: `url(${MESLOGO})`,
// // //     backgroundRepeat: "no-repeat",
// // //     backgroundPosition: "center",
// // //     backgroundSize: "500px",
// // //     opacity: 0.08,
// // //   }}
// // // ></div>
// // //       <div className="relative z-10 max-w-md w-full space-y-8">
// // //         <div>
// // //           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// // //             Welcome to OES
// // //           </h2>
// // //           <p className="mt-2 text-center text-sm text-gray-600">
// // //             Online Examination System
// // //           </p>
// // //         </div>

// // //         {/* Status Message */}
// // //         {message && (
// // //           <div className={`p-4 rounded-lg text-center font-medium ${messageType === "success"
// // //             ? "bg-green-100 text-green-700 border border-green-300"
// // //             : messageType === "error"
// // //               ? "bg-red-100 text-red-700 border border-red-300"
// // //               : "bg-blue-100 text-blue-700 border border-blue-300"
// // //             }`}>
// // //             {message}
// // //           </div>
// // //         )}

// // //         {/* Tab Navigation */}
// // //         <div className="flex justify-center">
// // //           <div className="bg-gray-100 p-1 rounded-lg">
// // //             <button
// // //               onClick={() => setActiveTab("teacher-login")}
// // //               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "teacher-login"
// // //                 ? "bg-white text-gray-900 shadow-sm"
// // //                 : "text-gray-500 hover:text-gray-700"
// // //                 }`}
// // //             >
// // //               Teacher Login
// // //             </button>
// // //             <button
// // //               onClick={() => setActiveTab("teacher-signup")}
// // //               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "teacher-signup"
// // //                 ? "bg-white text-gray-900 shadow-sm"
// // //                 : "text-gray-500 hover:text-gray-700"
// // //                 }`}
// // //             >
// // //               Teacher Signup
// // //             </button>
// // //             <button
// // //               onClick={() => setActiveTab("admin-login")}
// // //               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "admin-login"
// // //                 ? "bg-white text-gray-900 shadow-sm"
// // //                 : "text-gray-500 hover:text-gray-700"
// // //                 }`}
// // //             >
// // //               Controller Login
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* Teacher Login Form */}
// // //         {activeTab === "teacher-login" && (
// // //           <form className="mt-8 space-y-6" onSubmit={handleTeacherLogin}>
// // //             <div className="bg-white py-8 px-6 shadow-lg rounded-lg space-y-4">
// // //               <h3 className="text-lg font-medium text-gray-900 text-center">Teacher Login</h3>

// // //               <div>
// // //                 <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700">
// // //                   Email Address
// // //                 </label>
// // //                 <input
// // //                   id="teacher-email"
// // //                   name="email"
// // //                   type="email"
// // //                   required
// // //                   value={teacherLogin.email}
// // //                   onChange={handleTeacherLoginChange}
// // //                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                   placeholder="teacher@example.com"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <label htmlFor="teacher-password" className="block text-sm font-medium text-gray-700">
// // //                   Password
// // //                 </label>
// // //                 <input
// // //                   id="teacher-password"
// // //                   name="password"
// // //                   type="password"
// // //                   required
// // //                   value={teacherLogin.password}
// // //                   onChange={handleTeacherLoginChange}
// // //                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                   placeholder="Enter your password"
// // //                 />
// // //               </div>

// // //               <button
// // //                 type="submit"
// // //                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
// // //               >
// // //                 Sign In
// // //               </button>
// // //             </div>
// // //           </form>
// // //         )}

// // //         {/* Teacher Signup Form */}
// // //         {activeTab === "teacher-signup" && (
// // //           <form className="mt-8 space-y-6" onSubmit={handleTeacherSignup}>
// // //             <div className="bg-white py-8 px-6 shadow-lg rounded-lg space-y-4">
// // //               <h3 className="text-lg font-medium text-gray-900 text-center">Teacher Registration</h3>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">
// // //                     Full Name *
// // //                   </label>
// // //                   <input
// // //                     id="signup-name"
// // //                     name="name"
// // //                     type="text"
// // //                     required
// // //                     value={teacherSignup.name}
// // //                     onChange={handleTeacherSignupChange}
// // //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                     placeholder="John Doe"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label htmlFor="signup-teacherId" className="block text-sm font-medium text-gray-700">
// // //                     Teacher ID *
// // //                   </label>
// // //                   <input
// // //                     id="signup-teacherId"
// // //                     name="teacherId"
// // //                     type="text"
// // //                     required
// // //                     value={teacherSignup.teacherId}
// // //                     onChange={handleTeacherSignupChange}
// // //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                     placeholder="T001"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
// // //                   Email Address *
// // //                 </label>
// // //                 <input
// // //                   id="signup-email"
// // //                   name="email"
// // //                   type="email"
// // //                   required
// // //                   value={teacherSignup.email}
// // //                   onChange={handleTeacherSignupChange}
// // //                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                   placeholder="teacher@example.com"
// // //                 />
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label htmlFor="signup-department" className="block text-sm font-medium text-gray-700">
// // //                     Department *
// // //                   </label>
// // //                   <select
// // //                     id="signup-department"
// // //                     name="department"
// // //                     required
// // //                     value={teacherSignup.department}
// // //                     onChange={handleTeacherSignupChange}
// // //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
// // //                   >
// // //                     <option value="">Select Department</option>
// // //                     {[...new Set(departments.map(dept => dept.departmentName))].map(
// // //                       (departmentName) => (
// // //                         <option key={departmentName} value={departmentName}>
// // //                           {departmentName}
// // //                         </option>
// // //                       )
// // //                     )}
// // //                   </select>
// // //                   {departments.length === 0 && (
// // //                     <p className="mt-1 text-xs text-orange-600">
// // //                       No departments available. Please contact the controller to create departments.
// // //                     </p>
// // //                   )}
// // //                 </div>

// // //                 <div>
// // //                   <label htmlFor="signup-year" className="block text-sm font-medium text-gray-700">
// // //                     Academic Year *
// // //                   </label>
// // //                   <select
// // //                     id="signup-year"
// // //                     name="year"
// // //                     required
// // //                     value={teacherSignup.year}
// // //                     onChange={handleTeacherSignupChange}
// // //                     disabled={!teacherSignup.department}
// // //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
// // //                   >
// // //                     <option value="">
// // //                       {teacherSignup.department ? "Select Year" : "Select Department First"}
// // //                     </option>
// // //                     {departments
// // //                       .filter(dept => dept.departmentName === teacherSignup.department)
// // //                       .map(dept => (
// // //                         <option key={dept._id} value={dept.year}>
// // //                           {dept.year}
// // //                         </option>
// // //                       ))}
// // //                   </select>
// // //                   {teacherSignup.department && departments.filter(d => d.departmentName === teacherSignup.department).length === 0 && (
// // //                     <p className="mt-1 text-xs text-orange-600">
// // //                       No academic years available for this department.
// // //                     </p>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               <div>
// // //                 <label htmlFor="signup-subject" className="block text-sm font-medium text-gray-700">
// // //                   Subject *
// // //                 </label>
// // //                 <select
// // //                   id="signup-subject"
// // //                   name="subject"
// // //                   required
// // //                   value={teacherSignup.subject}
// // //                   onChange={handleTeacherSignupChange}
// // //                   disabled={!teacherSignup.department || !teacherSignup.year}
// // //                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
// // //                 >
// // //                   <option value="">
// // //                     {teacherSignup.department && teacherSignup.year ? "Select Subject" : "Select Department & Year First"}
// // //                   </option>
// // //                   {departments
// // //                     .filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year)
// // //                     .flatMap(dept => dept.subjects)
// // //                     .map((subject, index) => (
// // //                       <option key={index} value={subject}>
// // //                         {subject}
// // //                       </option>
// // //                     ))}
// // //                 </select>
// // //                 {teacherSignup.department && teacherSignup.year && departments.filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year).flatMap(dept => dept.subjects).length === 0 && (
// // //                   <p className="mt-1 text-xs text-orange-600">
// // //                     No subjects available for this department and year.
// // //                   </p>
// // //                 )}
// // //               </div>

// // //               <div className="grid grid-cols-2 gap-4">
// // //                 <div>
// // //                   <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
// // //                     Password *
// // //                   </label>
// // //                   <input
// // //                     id="signup-password"
// // //                     name="password"
// // //                     type="password"
// // //                     required
// // //                     value={teacherSignup.password}
// // //                     onChange={handleTeacherSignupChange}
// // //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                     placeholder="Min 6 characters"
// // //                   />
// // //                 </div>

// // //                 <div>
// // //                   <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700">
// // //                     Confirm Password *
// // //                   </label>
// // //                   <input
// // //                     id="signup-confirmPassword"
// // //                     name="confirmPassword"
// // //                     type="password"
// // //                     required
// // //                     value={teacherSignup.confirmPassword}
// // //                     onChange={handleTeacherSignupChange}
// // //                     className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
// // //                     placeholder="Confirm password"
// // //                   />
// // //                 </div>
// // //               </div>

// // //               <button
// // //                 type="submit"
// // //                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
// // //               >
// // //                 Register
// // //               </button>
// // //             </div>
// // //           </form>
// // //         )}

// // //         {/* Admin Login Form */}
// // //         {activeTab === "admin-login" && (
// // //           <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
// // //             <div className="bg-white py-8 px-6 shadow-lg rounded-lg space-y-4">
// // //               <h3 className="text-lg font-medium text-gray-900 text-center">Controller Login</h3>

// // //               <div>
// // //                 <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700">
// // //                   Controller Email
// // //                 </label>
// // //                 <input
// // //                   id="admin-email"
// // //                   name="email"
// // //                   type="email"
// // //                   required
// // //                   value={adminLogin.email}
// // //                   onChange={handleAdminLoginChange}
// // //                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
// // //                   placeholder="abc@gmail.com"
// // //                 />
// // //               </div>

// // //               <div>
// // //                 <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700">
// // //                   Password
// // //                 </label>
// // //                 <input
// // //                   id="admin-password"
// // //                   name="password"
// // //                   type="password"
// // //                   required
// // //                   value={adminLogin.password}
// // //                   onChange={handleAdminLoginChange}
// // //                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
// // //                   placeholder="Enter admin password"
// // //                 />
// // //               </div>

// // //               <button
// // //                 type="submit"
// // //                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
// // //               >
// // //                 Controller Login
// // //               </button>
// // //             </div>
// // //           </form>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default Login;


// // /////////////////////////////////////////////
// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import MESLOGO from "../assets/MES_logop.png"

// // const Login = () => {
// //   const navigate = useNavigate();
// //   const [activeTab, setActiveTab] = useState("teacher-login");
// //   const [message, setMessage] = useState("");
// //   const [messageType, setMessageType] = useState(""); // success, error, info
// //   const [departments, setDepartments] = useState([]);
// //   const [availableSubjects, setAvailableSubjects] = useState([]);
// //   const [availableYears, setAvailableYears] = useState([]);

// //   // Teacher Login State
// //   const [teacherLogin, setTeacherLogin] = useState({
// //     email: "",
// //     password: "",
// //   });

// //   // Teacher Signup State
// //   const [teacherSignup, setTeacherSignup] = useState({
// //     name: "",
// //     email: "",
// //     password: "",
// //     confirmPassword: "",
// //     department: "",
// //     year: "",
// //     subject: "",
// //     teacherId: "",
// //   });

// //   // Admin Login State
// //   const [adminLogin, setAdminLogin] = useState({
// //     email: "",
// //     password: "",
// //   });


// //   // Handle input changes
// //   const handleTeacherLoginChange = (e) => {
// //     const { name, value } = e.target;
// //     setTeacherLogin({ ...teacherLogin, [name]: value });
// //   };

// //   const handleTeacherSignupChange = (e) => {
// //     const { name, value } = e.target;
// //     setTeacherSignup({ ...teacherSignup, [name]: value });
// //   };

// //   const handleAdminLoginChange = (e) => {
// //     const { name, value } = e.target;
// //     setAdminLogin({ ...adminLogin, [name]: value });
// //   };

// //   // Show message function
// //   const showMessage = (text, type = "info") => {
// //     setMessage(text);
// //     setMessageType(type);
// //     setTimeout(() => {
// //       setMessage("");
// //       setMessageType("");
// //     }, 4000);
// //   };

// //   // Teacher Login Handler
// //   const handleTeacherLogin = async (e) => {
// //     e.preventDefault();

// //     if (!teacherLogin.email || !teacherLogin.password) {
// //       showMessage("❌ Please fill in all fields.", "error");
// //       return;
// //     }

// //     try {
// //       const res = await axios.post(
// //         "/loginTeacher",
// //         {
// //           email: teacherLogin.email,
// //           password: teacherLogin.password,
// //         },
// //         {
// //           withCredentials: true, // VERY IMPORTANT for cookies
// //         }
// //       );


// //       const teacherName =
// //         res?.data?.teacher?.name ||
// //         res?.data?.name ||
// //         res?.data?.teacherName;

// //       if (typeof teacherName === "string" && teacherName.trim()) {
// //         localStorage.setItem("teacherName", teacherName.trim());
// //       }
// //       const teacherDepartment = res?.data?.teacher?.department || res?.data?.department;
// //       if (teacherDepartment) {
// //         localStorage.setItem("teacherDepartment", teacherDepartment);
// //       }


// //       showMessage("✅ Login successful! Redirecting...", "success");

// //       setTimeout(() => {
// //         navigate("/teacher");
// //       }, 1500);

// //     } catch (error) {
// //       const message =
// //         error.response?.data?.message || "❌ Invalid email or password.";
// //       showMessage(message, "error");
// //     }
// //   };

// //   // Teacher Signup Handler


// //   const handleTeacherSignup = async (e) => {
// //     e.preventDefault();

// //     // Validation
// //     if (
// //       !teacherSignup.name ||
// //       !teacherSignup.email ||
// //       !teacherSignup.password ||
// //       !teacherSignup.confirmPassword ||
// //       !teacherSignup.department ||
// //       !teacherSignup.year ||
// //       !teacherSignup.subject ||
// //       !teacherSignup.teacherId
// //     ) {
// //       showMessage("❌ Please fill in all required fields.", "error");
// //       return;
// //     }

// //     if (teacherSignup.password !== teacherSignup.confirmPassword) {
// //       showMessage("❌ Passwords do not match.", "error");
// //       return;
// //     }

// //     if (teacherSignup.password.length < 6) {
// //       showMessage("❌ Password must be at least 6 characters long.", "error");
// //       return;
// //     }

// //     try {
// //       // API call
// //       await axios.post(
// //         "/teachersignup",
// //         {
// //           name: teacherSignup.name,
// //           email: teacherSignup.email,
// //           password: teacherSignup.password,
// //           confirmPassword: teacherSignup.confirmPassword,
// //           department: teacherSignup.department,
// //           year: teacherSignup.year,
// //           subject: teacherSignup.subject,
// //           teacherId: teacherSignup.teacherId,
// //         },
// //         {
// //           withCredentials: true, // important if backend sets cookies
// //         }
// //       );

// //       showMessage("✅ Registration successful! Please wait for admin approval before logging in.", "success");

// //       // Reset form
// //       setTeacherSignup({
// //         name: "",
// //         email: "",
// //         password: "",
// //         confirmPassword: "",
// //         department: "",
// //         year: "",
// //         subject: "",
// //         teacherId: "",
// //       });

// //       // Switch to login tab
// //       setActiveTab("teacher-login");

// //     } catch (error) {
// //       const message =
// //         error.response?.data?.message || "❌ Registration failed.";
// //       showMessage(message, "error");
// //     }
// //   };


// //   // Admin Login Handler
// //   const handleAdminLogin = async (e) => {
// //     e.preventDefault()

// //     const { email, password } = adminLogin

// //     if (!email?.trim() || !password?.trim()) {
// //       showMessage('❌ Please fill in all fields.', 'error')
// //       return
// //     }

// //     try {
// //       showMessage('⏳ Logging in...', 'info')

// //       await axios.post(
// //         '/controllerlogin',
// //         {
// //           email: email.trim(),
// //           password
// //         },
// //         {
// //           withCredentials: true // 🔐 cookie-based auth
// //         }
// //       )

// //       showMessage('✅ Controller login successful! Redirecting...', 'success')

// //       setTimeout(() => {
// //         navigate('/controller')
// //       }, 1200)

// //     } catch (error) {
// //       console.error('Admin login error:', error)

// //       showMessage(
// //         error.response?.data?.message || '❌ Login failed. Please try again.',
// //         'error'
// //       )
// //     }
// //   }

// //   //Fetch Departments on server
// //   useEffect(() => {
// //     const fetchDepartments = async () => {
// //       try {
// //         const res = await axios.get("/getTeacherDepartment", {

// //         });
// //         console.log(res, "res");

// //         setDepartments(res.data?.departments || []);
// //       } catch (error) {
// //         console.error("Failed to load departments:", error);
// //       }
// //     };

// //     fetchDepartments();
// //   }, []);

// //   // Update available years when department changes
// //   useEffect(() => {
// //     if (teacherSignup.department) {
// //       const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
// //       if (selectedDept) {
// //         const years = Object.keys(selectedDept.years || {});
// //         setAvailableYears(years);
// //       } else {
// //         setAvailableYears([]);
// //       }
// //     } else {
// //       setAvailableYears([]);
// //     }
// //   }, [teacherSignup.department, departments]);

// //   // Update available subjects when department and year changes
// //   useEffect(() => {
// //     if (teacherSignup.department && teacherSignup.year) {
// //       const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
// //       if (selectedDept && selectedDept.years[teacherSignup.year]) {
// //         setAvailableSubjects(selectedDept.years[teacherSignup.year]);
// //       } else {
// //         setAvailableSubjects([]);
// //       }
// //     } else {
// //       setAvailableSubjects([]);
// //     }
// //   }, [teacherSignup.department, teacherSignup.year, departments]);

// //   // Check if already logged in
// //   useEffect(() => {
// //     const teacher = localStorage.getItem("teacher");
// //     const controller = localStorage.getItem("controller");

// //     if (teacher) {
// //       navigate("/teacher");
// //     } else if (controller) {
// //       navigate("/controller");
// //     }
// //   }, [navigate]);

// //   return (
// //     <div className="min-h-screen flex font-out bg-gradient-to-br from-blue-50 via-white to-gray-50">
// //       {/* Left Side - Logo Section */}
// //       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
// //         {/* Decorative elements */}
// //         <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
// //         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
// //         <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        
// //         {/* Logo and Text Container */}
// //         <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
// //           <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
// //             <img 
// //               src={MESLOGO} 
// //               alt="College Logo" 
// //               className="w-72 h-auto object-contain drop-shadow-2xl"
// //             />
// //           </div>
// //           <div className="mt-8 text-center">
// //             <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
// //               Welcome to OES
// //             </h1>
// //             <p className="text-xl text-blue-100 drop-shadow-md">
// //               Online Examination System
// //             </p>
// //             <div className="mt-6 flex items-center justify-center space-x-2">
// //               <div className="h-1 w-12 bg-white/50 rounded"></div>
// //               <div className="h-1 w-8 bg-white/30 rounded"></div>
// //               <div className="h-1 w-4 bg-white/20 rounded"></div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Right Side - Forms Section */}
// //       <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
// //         <div className="w-full max-w-md space-y-6">
// //           {/* Mobile Logo */}
// //           <div className="lg:hidden text-center mb-8">
// //             <div className="inline-block bg-white p-4 rounded-2xl shadow-lg">
// //               <img 
// //                 src={MESLOGO} 
// //                 alt="College Logo" 
// //                 className="w-32 h-auto object-contain mx-auto"
// //               />
// //             </div>
// //             <h2 className="mt-4 text-2xl font-extrabold text-gray-900">
// //               Welcome to OES
// //             </h2>
// //             <p className="mt-1 text-sm text-gray-600">
// //               Online Examination System
// //             </p>
// //           </div>

// //           {/* Status Message */}
// //           {message && (
// //             <div className={`p-4 rounded-lg text-center font-medium animate-slideDown ${
// //               messageType === "success"
// //                 ? "bg-green-100 text-green-700 border border-green-300"
// //                 : messageType === "error"
// //                 ? "bg-red-100 text-red-700 border border-red-300"
// //                 : "bg-blue-100 text-blue-700 border border-blue-300"
// //             }`}>
// //               {message}
// //             </div>
// //           )}

// //           {/* Tab Navigation */}
// //           <div className="flex justify-center">
// //             <div className="bg-gray-100 p-1 rounded-xl shadow-sm">
// //               <button
// //                 onClick={() => setActiveTab("teacher-login")}
// //                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
// //                   activeTab === "teacher-login"
// //                     ? "bg-white text-blue-600 shadow-md"
// //                     : "text-gray-500 hover:text-gray-700"
// //                 }`}
// //               >
// //                 Teacher Login
// //               </button>
// //               <button
// //                 onClick={() => setActiveTab("teacher-signup")}
// //                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
// //                   activeTab === "teacher-signup"
// //                     ? "bg-white text-green-600 shadow-md"
// //                     : "text-gray-500 hover:text-gray-700"
// //                 }`}
// //               >
// //                 Teacher Signup
// //               </button>
// //               <button
// //                 onClick={() => setActiveTab("admin-login")}
// //                 className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
// //                   activeTab === "admin-login"
// //                     ? "bg-white text-red-600 shadow-md"
// //                     : "text-gray-500 hover:text-gray-700"
// //                 }`}
// //               >
// //                 Controller Login
// //               </button>
// //             </div>
// //           </div>

// //           {/* Teacher Login Form */}
// //           {activeTab === "teacher-login" && (
// //             <form className="space-y-6" onSubmit={handleTeacherLogin}>
// //               <div className="bg-white py-8 px-6 shadow-xl rounded-2xl space-y-4 border border-gray-100">
// //                 <h3 className="text-lg font-semibold text-gray-900 text-center">Teacher Login</h3>

// //                 <div>
// //                   <label htmlFor="teacher-email" className="block text-sm font-medium text-gray-700 mb-1">
// //                     Email Address
// //                   </label>
// //                   <input
// //                     id="teacher-email"
// //                     name="email"
// //                     type="email"
// //                     required
// //                     value={teacherLogin.email}
// //                     onChange={handleTeacherLoginChange}
// //                     className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //                     placeholder="teacher@example.com"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label htmlFor="teacher-password" className="block text-sm font-medium text-gray-700 mb-1">
// //                     Password
// //                   </label>
// //                   <input
// //                     id="teacher-password"
// //                     name="password"
// //                     type="password"
// //                     required
// //                     value={teacherLogin.password}
// //                     onChange={handleTeacherLoginChange}
// //                     className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
// //                     placeholder="Enter your password"
// //                   />
// //                 </div>

// //                 <button
// //                   type="submit"
// //                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02]"
// //                 >
// //                   Sign In
// //                 </button>
// //               </div>
// //             </form>
// //           )}

// //           {/* Teacher Signup Form */}
// //           {activeTab === "teacher-signup" && (
// //             <form className="space-y-6" onSubmit={handleTeacherSignup}>
// //               <div className="bg-white py-8 px-6 shadow-xl rounded-2xl space-y-4 border border-gray-100 max-h-[calc(100vh-12rem)] overflow-y-auto custom-scrollbar">
// //                 <h3 className="text-lg font-semibold text-gray-900 text-center sticky top-0 bg-white pb-2">Teacher Registration</h3>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Full Name *
// //                     </label>
// //                     <input
// //                       id="signup-name"
// //                       name="name"
// //                       type="text"
// //                       required
// //                       value={teacherSignup.name}
// //                       onChange={handleTeacherSignupChange}
// //                       className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
// //                       placeholder="John Doe"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label htmlFor="signup-teacherId" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Teacher ID *
// //                     </label>
// //                     <input
// //                       id="signup-teacherId"
// //                       name="teacherId"
// //                       type="text"
// //                       required
// //                       value={teacherSignup.teacherId}
// //                       onChange={handleTeacherSignupChange}
// //                       className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
// //                       placeholder="T001"
// //                     />
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
// //                     Email Address *
// //                   </label>
// //                   <input
// //                     id="signup-email"
// //                     name="email"
// //                     type="email"
// //                     required
// //                     value={teacherSignup.email}
// //                     onChange={handleTeacherSignupChange}
// //                     className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
// //                     placeholder="teacher@example.com"
// //                   />
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <label htmlFor="signup-department" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Department *
// //                     </label>
// //                     <select
// //                       id="signup-department"
// //                       name="department"
// //                       required
// //                       value={teacherSignup.department}
// //                       onChange={handleTeacherSignupChange}
// //                       className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white transition-all"
// //                     >
// //                       <option value="">Select Department</option>
// //                       {[...new Set(departments.map(dept => dept.departmentName))].map(
// //                         (departmentName) => (
// //                           <option key={departmentName} value={departmentName}>
// //                             {departmentName}
// //                           </option>
// //                         )
// //                       )}
// //                     </select>
// //                     {departments.length === 0 && (
// //                       <p className="mt-1 text-xs text-orange-600">
// //                         No departments available. Please contact the controller to create departments.
// //                       </p>
// //                     )}
// //                   </div>

// //                   <div>
// //                     <label htmlFor="signup-year" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Academic Year *
// //                     </label>
// //                     <select
// //                       id="signup-year"
// //                       name="year"
// //                       required
// //                       value={teacherSignup.year}
// //                       onChange={handleTeacherSignupChange}
// //                       disabled={!teacherSignup.department}
// //                       className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
// //                     >
// //                       <option value="">
// //                         {teacherSignup.department ? "Select Year" : "Select Department First"}
// //                       </option>
// //                       {departments
// //                         .filter(dept => dept.departmentName === teacherSignup.department)
// //                         .map(dept => (
// //                           <option key={dept._id} value={dept.year}>
// //                             {dept.year}
// //                           </option>
// //                         ))}
// //                     </select>
// //                     {teacherSignup.department && departments.filter(d => d.departmentName === teacherSignup.department).length === 0 && (
// //                       <p className="mt-1 text-xs text-orange-600">
// //                         No academic years available for this department.
// //                       </p>
// //                     )}
// //                   </div>
// //                 </div>

// //                 <div>
// //                   <label htmlFor="signup-subject" className="block text-sm font-medium text-gray-700 mb-1">
// //                     Subject *
// //                   </label>
// //                   <select
// //                     id="signup-subject"
// //                     name="subject"
// //                     required
// //                     value={teacherSignup.subject}
// //                     onChange={handleTeacherSignupChange}
// //                     disabled={!teacherSignup.department || !teacherSignup.year}
// //                     className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
// //                   >
// //                     <option value="">
// //                       {teacherSignup.department && teacherSignup.year ? "Select Subject" : "Select Department & Year First"}
// //                     </option>
// //                     {departments
// //                       .filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year)
// //                       .flatMap(dept => dept.subjects)
// //                       .map((subject, index) => (
// //                         <option key={index} value={subject}>
// //                           {subject}
// //                         </option>
// //                       ))}
// //                   </select>
// //                   {teacherSignup.department && teacherSignup.year && departments.filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year).flatMap(dept => dept.subjects).length === 0 && (
// //                     <p className="mt-1 text-xs text-orange-600">
// //                       No subjects available for this department and year.
// //                     </p>
// //                   )}
// //                 </div>

// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Password *
// //                     </label>
// //                     <input
// //                       id="signup-password"
// //                       name="password"
// //                       type="password"
// //                       required
// //                       value={teacherSignup.password}
// //                       onChange={handleTeacherSignupChange}
// //                       className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
// //                       placeholder="Min 6 characters"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label htmlFor="signup-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
// //                       Confirm Password *
// //                     </label>
// //                     <input
// //                       id="signup-confirmPassword"
// //                       name="confirmPassword"
// //                       type="password"
// //                       required
// //                       value={teacherSignup.confirmPassword}
// //                       onChange={handleTeacherSignupChange}
// //                       className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
// //                       placeholder="Confirm password"
// //                     />
// //                   </div>
// //                 </div>

// //                 <button
// //                   type="submit"
// //                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02]"
// //                 >
// //                   Register
// //                 </button>
// //               </div>
// //             </form>
// //           )}

// //           {/* Admin Login Form */}
// //           {activeTab === "admin-login" && (
// //             <form className="space-y-6" onSubmit={handleAdminLogin}>
// //               <div className="bg-white py-8 px-6 shadow-xl rounded-2xl space-y-4 border border-gray-100">
// //                 <h3 className="text-lg font-semibold text-gray-900 text-center">Controller Login</h3>

// //                 <div>
// //                   <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1">
// //                     Controller Email
// //                   </label>
// //                   <input
// //                     id="admin-email"
// //                     name="email"
// //                     type="email"
// //                     required
// //                     value={adminLogin.email}
// //                     onChange={handleAdminLoginChange}
// //                     className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
// //                     placeholder="abc@gmail.com"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1">
// //                     Password
// //                   </label>
// //                   <input
// //                     id="admin-password"
// //                     name="password"
// //                     type="password"
// //                     required
// //                     value={adminLogin.password}
// //                     onChange={handleAdminLoginChange}
// //                     className="block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
// //                     placeholder="Enter admin password"
// //                   />
// //                 </div>

// //                 <button
// //                   type="submit"
// //                   className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-[1.02]"
// //                 >
// //                   Controller Login
// //                 </button>
// //               </div>
// //             </form>
// //           )}
// //         </div>
// //       </div>

// //       {/* Add custom CSS for scrollbar */}
// //       <style jsx>{`
// //         .custom-scrollbar::-webkit-scrollbar {
// //           width: 6px;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-track {
// //           background: #f1f1f1;
// //           border-radius: 10px;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-thumb {
// //           background: #888;
// //           border-radius: 10px;
// //         }
// //         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
// //           background: #555;
// //         }
// //         @keyframes slideDown {
// //           from {
// //             opacity: 0;
// //             transform: translateY(-10px);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }
// //         .animate-slideDown {
// //           animation: slideDown 0.3s ease-out;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default Login;


// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import MESLOGO from "../assets/MES_logop.png"

// const Login = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("teacher-login");
//   const [message, setMessage] = useState("");
//   const [messageType, setMessageType] = useState(""); // success, error, info
//   const [departments, setDepartments] = useState([]);
//   const [availableSubjects, setAvailableSubjects] = useState([]);
//   const [availableYears, setAvailableYears] = useState([]);

//   // Teacher Login State
//   const [teacherLogin, setTeacherLogin] = useState({
//     email: "",
//     password: "",
//   });

//   // Teacher Signup State
//   const [teacherSignup, setTeacherSignup] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     department: "",
//     year: "",
//     subject: "",
//     teacherId: "",
//   });

//   // Admin Login State
//   const [adminLogin, setAdminLogin] = useState({
//     email: "",
//     password: "",
//   });


//   // Handle input changes
//   const handleTeacherLoginChange = (e) => {
//     const { name, value } = e.target;
//     setTeacherLogin({ ...teacherLogin, [name]: value });
//   };

//   const handleTeacherSignupChange = (e) => {
//     const { name, value } = e.target;
//     setTeacherSignup({ ...teacherSignup, [name]: value });
//   };

//   const handleAdminLoginChange = (e) => {
//     const { name, value } = e.target;
//     setAdminLogin({ ...adminLogin, [name]: value });
//   };

//   // Show message function
//   const showMessage = (text, type = "info") => {
//     setMessage(text);
//     setMessageType(type);
//     setTimeout(() => {
//       setMessage("");
//       setMessageType("");
//     }, 4000);
//   };

//   // Teacher Login Handler
//   const handleTeacherLogin = async (e) => {
//     e.preventDefault();

//     if (!teacherLogin.email || !teacherLogin.password) {
//       showMessage("❌ Please fill in all fields.", "error");
//       return;
//     }

//     try {
//       const res = await axios.post(
//         "/loginTeacher",
//         {
//           email: teacherLogin.email,
//           password: teacherLogin.password,
//         },
//         {
//           withCredentials: true, // VERY IMPORTANT for cookies
//         }
//       );


//       const teacherName =
//         res?.data?.teacher?.name ||
//         res?.data?.name ||
//         res?.data?.teacherName;

//       if (typeof teacherName === "string" && teacherName.trim()) {
//         localStorage.setItem("teacherName", teacherName.trim());
//       }
//       const teacherDepartment = res?.data?.teacher?.department || res?.data?.department;
//       if (teacherDepartment) {
//         localStorage.setItem("teacherDepartment", teacherDepartment);
//       }


//       showMessage("✅ Login successful! Redirecting...", "success");

//       setTimeout(() => {
//         navigate("/teacher");
//       }, 1500);

//     } catch (error) {
//       const message =
//         error.response?.data?.message || "❌ Invalid email or password.";
//       showMessage(message, "error");
//     }
//   };

//   // Teacher Signup Handler


//   const handleTeacherSignup = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (
//       !teacherSignup.name ||
//       !teacherSignup.email ||
//       !teacherSignup.password ||
//       !teacherSignup.confirmPassword ||
//       !teacherSignup.department ||
//       !teacherSignup.year ||
//       !teacherSignup.subject ||
//       !teacherSignup.teacherId
//     ) {
//       showMessage("❌ Please fill in all required fields.", "error");
//       return;
//     }

//     if (teacherSignup.password !== teacherSignup.confirmPassword) {
//       showMessage("❌ Passwords do not match.", "error");
//       return;
//     }

//     if (teacherSignup.password.length < 6) {
//       showMessage("❌ Password must be at least 6 characters long.", "error");
//       return;
//     }

//     try {
//       // API call
//       await axios.post(
//         "/teachersignup",
//         {
//           name: teacherSignup.name,
//           email: teacherSignup.email,
//           password: teacherSignup.password,
//           confirmPassword: teacherSignup.confirmPassword,
//           department: teacherSignup.department,
//           year: teacherSignup.year,
//           subject: teacherSignup.subject,
//           teacherId: teacherSignup.teacherId,
//         },
//         {
//           withCredentials: true, // important if backend sets cookies
//         }
//       );

//       showMessage("✅ Registration successful! Please wait for admin approval before logging in.", "success");

//       // Reset form
//       setTeacherSignup({
//         name: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//         department: "",
//         year: "",
//         subject: "",
//         teacherId: "",
//       });

//       // Switch to login tab
//       setActiveTab("teacher-login");

//     } catch (error) {
//       const message =
//         error.response?.data?.message || "❌ Registration failed.";
//       showMessage(message, "error");
//     }
//   };


//   // Admin Login Handler
//   const handleAdminLogin = async (e) => {
//     e.preventDefault()

//     const { email, password } = adminLogin

//     if (!email?.trim() || !password?.trim()) {
//       showMessage('❌ Please fill in all fields.', 'error')
//       return
//     }

//     try {
//       showMessage('⏳ Logging in...', 'info')

//       await axios.post(
//         '/controllerlogin',
//         {
//           email: email.trim(),
//           password
//         },
//         {
//           withCredentials: true // 🔐 cookie-based auth
//         }
//       )

//       showMessage('✅ Controller login successful! Redirecting...', 'success')

//       setTimeout(() => {
//         navigate('/controller')
//       }, 1200)

//     } catch (error) {
//       console.error('Admin login error:', error)

//       showMessage(
//         error.response?.data?.message || '❌ Login failed. Please try again.',
//         'error'
//       )
//     }
//   }

//   //Fetch Departments on server
//   useEffect(() => {
//     const fetchDepartments = async () => {
//       try {
//         const res = await axios.get("/getTeacherDepartment", {

//         });
//         console.log(res, "res");

//         setDepartments(res.data?.departments || []);
//       } catch (error) {
//         console.error("Failed to load departments:", error);
//       }
//     };

//     fetchDepartments();
//   }, []);

//   // Update available years when department changes
//   useEffect(() => {
//     if (teacherSignup.department) {
//       const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
//       if (selectedDept) {
//         const years = Object.keys(selectedDept.years || {});
//         setAvailableYears(years);
//       } else {
//         setAvailableYears([]);
//       }
//     } else {
//       setAvailableYears([]);
//     }
//   }, [teacherSignup.department, departments]);

//   // Update available subjects when department and year changes
//   useEffect(() => {
//     if (teacherSignup.department && teacherSignup.year) {
//       const selectedDept = departments.find(dept => dept.name === teacherSignup.department);
//       if (selectedDept && selectedDept.years[teacherSignup.year]) {
//         setAvailableSubjects(selectedDept.years[teacherSignup.year]);
//       } else {
//         setAvailableSubjects([]);
//       }
//     } else {
//       setAvailableSubjects([]);
//     }
//   }, [teacherSignup.department, teacherSignup.year, departments]);

//   // Check if already logged in
//   useEffect(() => {
//     const teacher = localStorage.getItem("teacher");
//     const controller = localStorage.getItem("controller");

//     if (teacher) {
//       navigate("/teacher");
//     } else if (controller) {
//       navigate("/controller");
//     }
//   }, [navigate]);

//   return (
//     <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-out overflow-hidden">
//       {/* Gradient Background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
      
//       {/* Background Logo - Increased opacity and size */}
//       <div
//         className="absolute inset-0 flex items-center justify-center pointer-events-none"
//         style={{
//           backgroundImage: `url(${MESLOGO})`,
//           backgroundRepeat: "no-repeat",
//           backgroundPosition: "center",
//           backgroundSize: "550px",
//           opacity: 0.2,
//         }}
//       ></div>

//       {/* Decorative Elements */}
//       <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//       <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//       <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

//       <div className="relative z-10 max-w-md w-full space-y-8">
//         {/* Header */}
//         <div className="text-center">
//           <div className="inline-block p-3 bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg mb-4 border border-white/40">
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
//               <span className="text-white text-2xl font-bold">OES</span>
//             </div>
//           </div>
//           <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
//             Welcome Back
//           </h2>
//           <p className="text-base text-gray-600">
//             Online Examination System
//           </p>
//         </div>

//         {/* Status Message */}
//         {message && (
//           <div className={`p-4 rounded-xl text-center font-medium backdrop-blur-md border-2 shadow-lg transform transition-all duration-300 ${
//             messageType === "success"
//               ? "bg-green-50/80 text-green-800 border-green-200"
//               : messageType === "error"
//               ? "bg-red-50/80 text-red-800 border-red-200"
//               : "bg-blue-50/80 text-blue-800 border-blue-200"
//           }`}>
//             {message}
//           </div>
//         )}

//         {/* Tab Navigation - More transparent */}
//         <div className="flex justify-center">
//           <div className="bg-white/30 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-white/40">
//             <button
//               onClick={() => setActiveTab("teacher-login")}
//               className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
//                 activeTab === "teacher-login"
//                   ? "bg-white/80 text-blue-700 shadow-md"
//                   : "text-gray-700 hover:text-gray-900 hover:bg-white/40"
//               }`}
//             >
//               Teacher Login
//             </button>
//             <button
//               onClick={() => setActiveTab("teacher-signup")}
//               className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
//                 activeTab === "teacher-signup"
//                   ? "bg-white/80 text-blue-700 shadow-md"
//                   : "text-gray-700 hover:text-gray-900 hover:bg-white/40"
//               }`}
//             >
//               Teacher Signup
//             </button>
//             <button
//               onClick={() => setActiveTab("admin-login")}
//               className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
//                 activeTab === "admin-login"
//                   ? "bg-white/80 text-blue-700 shadow-md"
//                   : "text-gray-700 hover:text-gray-900 hover:bg-white/40"
//               }`}
//             >
//               Controller
//             </button>
//           </div>
//         </div>

//         {/* Teacher Login Form - More transparent */}
//         {activeTab === "teacher-login" && (
//           <form className="mt-8 space-y-6" onSubmit={handleTeacherLogin}>
// <div className="bg-white/10 backdrop-blur-sm py-8 px-6 shadow-2xl rounded-2xl space-y-5 border border-white/20">              
// <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Teacher Login</h3>

//               <div>
//                 <label htmlFor="teacher-email" className="block text-sm font-semibold text-gray-800 mb-2">
//                   Email Address
//                 </label>
//                 <input
//                   id="teacher-email"
//                   name="email"
//                   type="email"
//                   required
//                   value={teacherLogin.email}
//                   onChange={handleTeacherLoginChange}
//                   className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                   placeholder="teacher@example.com"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="teacher-password" className="block text-sm font-semibold text-gray-800 mb-2">
//                   Password
//                 </label>
//                 <input
//                   id="teacher-password"
//                   name="password"
//                   type="password"
//                   required
//                   value={teacherLogin.password}
//                   onChange={handleTeacherLoginChange}
//                   className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                   placeholder="Enter your password"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02] mt-6"
//               >
//                 Sign In
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Teacher Signup Form - More transparent */}
//         {activeTab === "teacher-signup" && (
//           <form className="mt-8 space-y-6" onSubmit={handleTeacherSignup}>
//             <div className="bg-white/50 backdrop-blur-lg py-8 px-6 shadow-2xl rounded-2xl space-y-4 border border-white/50 max-h-[calc(100vh-16rem)] overflow-y-auto">
//               <h3 className="text-xl font-bold text-gray-900 text-center mb-2 sticky top-0 bg-white/50 backdrop-blur-lg py-2 -mx-6 px-6 z-10">Teacher Registration</h3>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-800 mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     id="signup-name"
//                     name="name"
//                     type="text"
//                     required
//                     value={teacherSignup.name}
//                     onChange={handleTeacherSignupChange}
//                     className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                     placeholder="John Doe"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="signup-teacherId" className="block text-sm font-semibold text-gray-800 mb-2">
//                     Teacher ID *
//                   </label>
//                   <input
//                     id="signup-teacherId"
//                     name="teacherId"
//                     type="text"
//                     required
//                     value={teacherSignup.teacherId}
//                     onChange={handleTeacherSignupChange}
//                     className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                     placeholder="T001"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-800 mb-2">
//                   Email Address *
//                 </label>
//                 <input
//                   id="signup-email"
//                   name="email"
//                   type="email"
//                   required
//                   value={teacherSignup.email}
//                   onChange={handleTeacherSignupChange}
//                   className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                   placeholder="teacher@example.com"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="signup-department" className="block text-sm font-semibold text-gray-800 mb-2">
//                     Department *
//                   </label>
//                   <select
//                     id="signup-department"
//                     name="department"
//                     required
//                     value={teacherSignup.department}
//                     onChange={handleTeacherSignupChange}
//                     className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm transition-all"
//                   >
//                     <option value="">Select Department</option>
//                     {[...new Set(departments.map(dept => dept.departmentName))].map(
//                       (departmentName) => (
//                         <option key={departmentName} value={departmentName}>
//                           {departmentName}
//                         </option>
//                       )
//                     )}
//                   </select>
//                   {departments.length === 0 && (
//                     <p className="mt-2 text-xs text-orange-800 bg-orange-50/70 backdrop-blur-sm p-2 rounded-lg">
//                       No departments available. Please contact the controller to create departments.
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="signup-year" className="block text-sm font-semibold text-gray-800 mb-2">
//                     Academic Year *
//                   </label>
//                   <select
//                     id="signup-year"
//                     name="year"
//                     required
//                     value={teacherSignup.year}
//                     onChange={handleTeacherSignupChange}
//                     disabled={!teacherSignup.department}
//                     className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm disabled:bg-gray-100/70 disabled:cursor-not-allowed transition-all"
//                   >
//                     <option value="">
//                       {teacherSignup.department ? "Select Year" : "Select Department First"}
//                     </option>
//                     {departments
//                       .filter(dept => dept.departmentName === teacherSignup.department)
//                       .map(dept => (
//                         <option key={dept._id} value={dept.year}>
//                           {dept.year}
//                         </option>
//                       ))}
//                   </select>
//                   {teacherSignup.department && departments.filter(d => d.departmentName === teacherSignup.department).length === 0 && (
//                     <p className="mt-2 text-xs text-orange-800 bg-orange-50/70 backdrop-blur-sm p-2 rounded-lg">
//                       No academic years available for this department.
//                     </p>
//                   )}
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="signup-subject" className="block text-sm font-semibold text-gray-800 mb-2">
//                   Subject *
//                 </label>
//                 <select
//                   id="signup-subject"
//                   name="subject"
//                   required
//                   value={teacherSignup.subject}
//                   onChange={handleTeacherSignupChange}
//                   disabled={!teacherSignup.department || !teacherSignup.year}
//                   className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm disabled:bg-gray-100/70 disabled:cursor-not-allowed transition-all"
//                 >
//                   <option value="">
//                     {teacherSignup.department && teacherSignup.year ? "Select Subject" : "Select Department & Year First"}
//                   </option>
//                   {departments
//                     .filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year)
//                     .flatMap(dept => dept.subjects)
//                     .map((subject, index) => (
//                       <option key={index} value={subject}>
//                         {subject}
//                       </option>
//                     ))}
//                 </select>
//                 {teacherSignup.department && teacherSignup.year && departments.filter(dept => dept.departmentName === teacherSignup.department && dept.year === teacherSignup.year).flatMap(dept => dept.subjects).length === 0 && (
//                   <p className="mt-2 text-xs text-orange-800 bg-orange-50/70 backdrop-blur-sm p-2 rounded-lg">
//                     No subjects available for this department and year.
//                   </p>
//                 )}
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-800 mb-2">
//                     Password *
//                   </label>
//                   <input
//                     id="signup-password"
//                     name="password"
//                     type="password"
//                     required
//                     value={teacherSignup.password}
//                     onChange={handleTeacherSignupChange}
//                     className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                     placeholder="Min 6 characters"
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="signup-confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
//                     Confirm Password *
//                   </label>
//                   <input
//                     id="signup-confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     required
//                     value={teacherSignup.confirmPassword}
//                     onChange={handleTeacherSignupChange}
//                     className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                     placeholder="Confirm password"
//                   />
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-[1.02] mt-6"
//               >
//                 Register
//               </button>
//             </div>
//           </form>
//         )}

//         {/* Admin Login Form - More transparent */}
//         {activeTab === "admin-login" && (
//           <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
//             <div className="bg-white/50 backdrop-blur-lg py-8 px-6 shadow-2xl rounded-2xl space-y-5 border border-white/50">
//               <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Controller Login</h3>

//               <div>
//                 <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-800 mb-2">
//                   Controller Email
//                 </label>
//                 <input
//                   id="admin-email"
//                   name="email"
//                   type="email"
//                   required
//                   value={adminLogin.email}
//                   onChange={handleAdminLoginChange}
//                   className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                   placeholder="abc@gmail.com"
//                 />
//               </div>

//               <div>
//                 <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-800 mb-2">
//                   Password
//                 </label>
//                 <input
//                   id="admin-password"
//                   name="password"
//                   type="password"
//                   required
//                   value={adminLogin.password}
//                   onChange={handleAdminLoginChange}
//                   className="block w-full px-4 py-3 border-2 border-white/60 rounded-xl shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white/70 backdrop-blur-sm"
//                   placeholder="Enter admin password"
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-[1.02] mt-6"
//               >
//                 Controller Login
//               </button>
//             </div>
//           </form>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes blob {
//           0% { transform: translate(0px, 0px) scale(1); }
//           33% { transform: translate(30px, -50px) scale(1.1); }
//           66% { transform: translate(-20px, 20px) scale(0.9); }
//           100% { transform: translate(0px, 0px) scale(1); }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//         .animation-delay-4000 {
//           animation-delay: 4s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MESLOGO from "../assets/MES_logop.png"

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
    <div className="min-h-screen flex font-out">
      {/* Left Side - Logo Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
            <img 
              src={MESLOGO} 
              alt="MES Logo" 
              className="w-64 h-64 object-contain drop-shadow-2xl"
            />
          </div>
          
          <h1 className="text-5xl font-extrabold mb-4 text-center drop-shadow-lg">
            Welcome to OES
          </h1>
          
          <p className="text-xl text-blue-100 text-center max-w-md mb-8">
            Online Examination System
          </p>

          <div className="w-24 h-1 bg-white/50 rounded-full mb-8"></div>

          <p className="text-lg text-blue-50 text-center max-w-lg leading-relaxed">
            A comprehensive platform for managing examinations, assessments, and academic performance tracking with modern technology.
          </p>

          {/* Decorative elements */}
          <div className="absolute bottom-10 left-10 flex gap-3">
            <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-white/50 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 relative">
        {/* Mobile Logo */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 lg:hidden">
          <img 
            src={MESLOGO} 
            alt="MES Logo" 
            className="w-20 h-20 object-contain"
          />
        </div>

        <div className="w-full max-w-md mt-20 lg:mt-0">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {activeTab === "teacher-login" ? "Teacher Login" : 
               activeTab === "teacher-signup" ? "Teacher Registration" : 
               "Controller Login"}
            </h2>
            <p className="text-gray-600">
              {activeTab === "teacher-login" ? "Sign in to access your dashboard" : 
               activeTab === "teacher-signup" ? "Create your teacher account" : 
               "Administrative access only"}
            </p>
          </div>

          {/* Status Message */}
          {message && (
            <div className={`p-4 rounded-xl text-sm font-medium mb-6 ${
              messageType === "success"
                ? "bg-green-50 text-green-800 border-2 border-green-200"
                : messageType === "error"
                ? "bg-red-50 text-red-800 border-2 border-red-200"
                : "bg-blue-50 text-blue-800 border-2 border-blue-200"
            }`}>
              {message}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 bg-white p-2 rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab("teacher-login")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "teacher-login"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Teacher Login
            </button>
            <button
              onClick={() => setActiveTab("teacher-signup")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "teacher-signup"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Signup
            </button>
            <button
              onClick={() => setActiveTab("admin-login")}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === "admin-login"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Controller
            </button>
          </div>

          {/* Teacher Login Form */}
          {activeTab === "teacher-login" && (
            <form className="space-y-5" onSubmit={handleTeacherLogin}>
              <div>
                <label htmlFor="teacher-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="teacher-email"
                  name="email"
                  type="email"
                  required
                  value={teacherLogin.email}
                  onChange={handleTeacherLoginChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="teacher@example.com"
                />
              </div>

              <div>
                <label htmlFor="teacher-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="teacher-password"
                  name="password"
                  type="password"
                  required
                  value={teacherLogin.password}
                  onChange={handleTeacherLoginChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Sign In
              </button>
            </form>
          )}

          {/* Teacher Signup Form */}
          {activeTab === "teacher-signup" && (
            <form className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto px-1" onSubmit={handleTeacherSignup}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    required
                    value={teacherSignup.name}
                    onChange={handleTeacherSignupChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="signup-teacherId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Teacher ID *
                  </label>
                  <input
                    id="signup-teacherId"
                    name="teacherId"
                    type="text"
                    required
                    value={teacherSignup.teacherId}
                    onChange={handleTeacherSignupChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="T001"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  value={teacherSignup.email}
                  onChange={handleTeacherSignupChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="teacher@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-department" className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <select
                    id="signup-department"
                    name="department"
                    required
                    value={teacherSignup.department}
                    onChange={handleTeacherSignupChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
                    <p className="mt-2 text-xs text-orange-700 bg-orange-50 p-2 rounded-lg">
                      No departments available.
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="signup-year" className="block text-sm font-semibold text-gray-700 mb-2">
                    Academic Year *
                  </label>
                  <select
                    id="signup-year"
                    name="year"
                    required
                    value={teacherSignup.year}
                    onChange={handleTeacherSignupChange}
                    disabled={!teacherSignup.department}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {teacherSignup.department ? "Select Year" : "Select Dept First"}
                    </option>
                    {departments
                      .filter(dept => dept.departmentName === teacherSignup.department)
                      .map(dept => (
                        <option key={dept._id} value={dept.year}>
                          {dept.year}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="signup-subject" className="block text-sm font-semibold text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  id="signup-subject"
                  name="subject"
                  required
                  value={teacherSignup.subject}
                  onChange={handleTeacherSignupChange}
                  disabled={!teacherSignup.department || !teacherSignup.year}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {teacherSignup.department && teacherSignup.year ? "Select Subject" : "Select Dept & Year First"}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    value={teacherSignup.password}
                    onChange={handleTeacherSignupChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Min 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="signup-confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    id="signup-confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={teacherSignup.confirmPassword}
                    onChange={handleTeacherSignupChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Register
              </button>
            </form>
          )}

          {/* Admin Login Form */}
          {activeTab === "admin-login" && (
            <form className="space-y-5" onSubmit={handleAdminLogin}>
              <div>
                <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Controller Email
                </label>
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  value={adminLogin.email}
                  onChange={handleAdminLoginChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="controller@example.com"
                />
              </div>

              <div>
                <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  required
                  value={adminLogin.password}
                  onChange={handleAdminLoginChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Enter admin password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                Controller Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;