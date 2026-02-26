import React from "react";
import { FaUsers, FaSchool, FaBell, FaBook, FaClipboardCheck, FaChartLine, FaClock, FaCheckCircle } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { GiTeacher } from "react-icons/gi";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";
import { useEffect, useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
const ControllerDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTeachers: 0,
    totalStudents: 0,
    totalDepartments: 0,
    totalSubjects: 0,
    pendingExams: 0,
    evaluatedExams: 0,
  });

  const [activities, setActivities] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/getDashboardData", {
          withCredentials: true,
        });
        // console.log(res,"resDas");

        setDashboardData(res.data.stats);
        setActivities(res.data.recentActivities || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper to format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "exam":
        return <FaBook className="text-blue-600" />;
      case "teacher":
        return <GiTeacher className="text-green-600" />;
      case "upload":
        return <FaClipboardCheck className="text-teal-600" />;
      default:
        return <FaChartLine className="text-orange-600" />;
    }
  };


  const stats = [
    {
      title: "Total Teachers",
      value: dashboardData.totalTeachers || 0,
      change: "+2",
      changeType: "increase",
      icon: <GiTeacher size={24} />,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Total Departments",
      value: dashboardData.totalDepartments || 0,
      change: "0",
      changeType: "neutral",
      icon: <FaSchool size={24} />,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
    },
    {
      title: "Total Students",
      value: dashboardData.totalStudents || 0,
      change: "+12",
      changeType: "increase",
      icon: <FaUsers size={24} />,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Total Subjects",
      value: dashboardData.totalSubjects || 0,
      change: "+1",
      changeType: "increase",
      icon: <FaBook size={24} />,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
    {
      title: "Pending Evaluations",
      value: dashboardData.pendingExams || 0,
      change: "-5",
      changeType: "decrease",
      icon: <MdPendingActions size={24} />,
      color: "from-red-500 to-red-600",
      bgColor: "from-red-50 to-red-100",
    },
    {
      title: "Evaluated Papers",
      value: dashboardData.evaluatedExams || 0,
      change: "+23",
      changeType: "increase",
      icon: <FaClipboardCheck size={24} />,
      color: "from-teal-500 to-teal-600",
      bgColor: "from-teal-50 to-teal-100",
    },
  ];



const quickActions = [
  {
    title: "Create Exam",
    description: "Set up new examination",
    icon: <FaBook className="text-blue-600" />,
    bgColor: "bg-blue-50",
    route: "/controller/create-exam"
  },
  {
    title: "Manage Teachers",
    description: "Add or remove teachers",
    icon: <GiTeacher className="text-green-600" />,
    bgColor: "bg-green-50",
    route: "/controller/manage-teacher"
  },
  {
    title: "Add Department",
    description: "Create new department",
    icon: <FaSchool className="text-purple-600" />,
    bgColor: "bg-purple-50",
    route: "/controller/add-department"
  },
  {
    title: "View Reports",
    description: "Check performance reports",
    icon: <FaChartLine className="text-orange-600" />,
    bgColor: "bg-orange-50",
    route: "/controller/resultsmanage-"
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 font-out">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Controller Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back! Here's an overview of your examination system.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${item.bgColor} border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color} text-white shadow-lg`}>
                {item.icon}
              </div>
              <div className="flex items-center gap-1">
                {item.changeType === "increase" && (
                  <BsArrowUp className="text-green-600" size={14} />
                )}
                {item.changeType === "decrease" && (
                  <BsArrowDown className="text-red-600" size={14} />
                )}
                <span className={`text-sm font-medium ${item.changeType === "increase" ? "text-green-600" :
                  item.changeType === "decrease" ? "text-red-600" : "text-gray-600"
                  }`}>
                  {item.change}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{item.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{item.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaBell className="text-blue-600" />
              Quick Actions
            </h2>

            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.route)}
                  className={`w-full p-4 ${action.bgColor} border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 text-left group`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-300">
                      {action.icon}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaClock className="text-blue-600" />
              Recent Activities
            </h2>

            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No recent activities found.</p>
              ) : (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClock size={10} />
                        {formatRelativeTime(activity.time)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="w-full py-2 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 font-medium">
                View All Activities
              </button>
            </div> */}
          </div>
        </div>
      </div>

    </div>
  );
};

export default ControllerDashboard;
