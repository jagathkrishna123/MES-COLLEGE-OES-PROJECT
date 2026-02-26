import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { FaUsers, FaBook, FaSchool, FaChartLine, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const TeacherAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get("/getTeacherAnalyticsData", { withCredentials: true });
                setAnalyticsData(res.data.stats);
            } catch (error) {
                console.error("Error fetching teacher analytics:", error);
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
        { title: "Total Students", value: analyticsData.totalStudents, icon: <FaUsers />, color: "bg-blue-500" },
        { title: "Total Exams", value: analyticsData.totalExams, icon: <FaBook />, color: "bg-green-500" },
        { title: "Subjects", value: analyticsData.totalSubjects, icon: <FaSchool />, color: "bg-purple-500" },
        { title: "Department", value: analyticsData.department, icon: <FaChartLine />, color: "bg-orange-500", isText: true },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-out">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Departmental Analytics</h1>
                <p className="text-gray-600">Track student performance and exam status across your department.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.color} text-white`}>
                                {React.cloneElement(card.icon, { size: 24 })}
                            </div>
                        </div>
                        <h3 className="text-gray-500 font-medium text-sm">{card.title}</h3>
                        <p className={`font-bold text-gray-800 ${card.isText ? 'text-lg' : 'text-2xl'}`}>{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Main Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Exam Status Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 italic">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 font-out">Exam Status Overview</h3>
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

                {/* Creation Trends Area Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Exam Activity Trends</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData.trends}>
                                <defs>
                                    <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF' }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="exams" stroke="#3B82F6" fillOpacity={1} fill="url(#colorExams)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Bar Chart - Full Width */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-6">Exam Performance Comparison</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData.performanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4B5563' }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="rect" />
                            <Bar dataKey="avgMarks" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="Average Marks (%)" barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <h3 className="text-lg font-bold text-gray-800">Subject-wise Evaluation Status</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-sm font-medium">
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">Total Students</th>
                                <th className="px-6 py-4">Evaluated</th>
                                <th className="px-6 py-4">Avg. Score</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {analyticsData.performanceData.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.totalStudents}</td>
                                    <td className="px-6 py-4 text-gray-600">{item.evaluated}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${item.avgMarks >= 70 ? 'text-green-600' : item.avgMarks >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                                            {item.avgMarks}%
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">
                                        {item.evaluated === item.totalStudents ? (
                                            <span className="flex items-center gap-2 text-green-600 font-medium">
                                                <FaCheckCircle /> Complete
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-yellow-600 font-medium">
                                                <FaExclamationCircle /> In Progress
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TeacherAnalytics;