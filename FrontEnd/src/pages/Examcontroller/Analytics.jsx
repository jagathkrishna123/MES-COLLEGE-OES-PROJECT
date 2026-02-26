import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';
import { FaUsers, FaSchool, FaBook, FaChartLine, FaArrowUp, FaArrowDown, FaFilter } from 'react-icons/fa';
import { GiTeacher } from 'react-icons/gi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get("/getAnalyticsData", { withCredentials: true });
        setAnalyticsData(res.data.stats);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!analyticsData) return <div className="p-8 text-center text-gray-500">No data available</div>;

  const summaryCards = [
    { title: "Total Teachers", value: analyticsData.totalTeachers, icon: <GiTeacher />, color: "bg-blue-500" },
    { title: "Total Students", value: analyticsData.totalStudents, icon: <FaUsers />, color: "bg-green-500" },
    { title: "Total Exams", value: analyticsData.totalExams, icon: <FaBook />, color: "bg-purple-500" },
    { title: "Departments", value: analyticsData.totalDepartments, icon: <FaSchool />, color: "bg-orange-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-out">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">System Analytics</h1>
          <p className="text-gray-600">Deep dive into the examination system performance and statistics.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.color} text-white`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                <FaArrowUp size={12} /> 12%
              </span>
            </div>
            <h3 className="text-gray-500 font-medium text-sm">{card.title}</h3>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Exam Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 italic">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Exam Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.examStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.examStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Exam Trends Area Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Exam Creation Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.trends}>
                <defs>
                  <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                <Tooltip />
                <Area type="monotone" dataKey="exams" stroke="#8884d8" fillOpacity={1} fill="url(#colorExams)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 gap-8">
        {/* Department Wise Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Department Metrics Overview</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.deptWiseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4B5563' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563' }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="exams" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Total Exams" />
                <Bar dataKey="subjects" fill="#10B981" radius={[6, 6, 0, 0]} name="Total Subjects" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;