import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFileDownload, FaSearch, FaUser, FaCalendarAlt, FaInfoCircle, FaInbox } from 'react-icons/fa';

const SharedFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    const fetchFiles = async () => {
        try {
            const response = await axios.get('/getSharedFiles', { withCredentials: true });
            setFiles(response.data);
        } catch (err) {
            console.error('Error fetching shared files:', err);
            setError('Failed to load shared files. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDownload = (fileUrl, fileName) => {
        const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const downloadUrl = `${BASE_URL}/uploads/${fileUrl}`;

        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', fileName);
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredFiles = files.filter(file =>
        file.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (file.remark && file.remark.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 font-out">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Shared Files Inbox</h1>
                        <p className="text-gray-600">Review and download documents shared by the teaching staff.</p>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by subject or teacher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full md:w-80 shadow-sm"
                        />
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 animate-pulse">Fetching shared documents...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="bg-red-50 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaInfoCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{error}</h3>
                        <button
                            onClick={fetchFiles}
                            className="text-blue-600 hover:text-blue-700 font-medium underline"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredFiles.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="bg-gray-50 text-gray-300 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaInbox size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                            {searchTerm ? 'No matches found' : 'No shared files yet'}
                        </h3>
                        <p className="text-gray-500 italic max-w-sm mx-auto">
                            {searchTerm ? 'Try a different search term.' : 'When teachers share documents, they will appear here.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredFiles.map((file) => (
                            <div
                                key={file._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group flex flex-col md:flex-row md:items-center gap-6"
                            >
                                {/* File Icon Branding */}
                                <div className="shrink-0 w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                    <FaFileDownload size={28} />
                                </div>

                                {/* Details */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                                            {file.fileName.split('.').pop()}
                                        </span>
                                        <h3 className="text-xl font-bold text-gray-900">{file.subject}</h3>
                                    </div>

                                    {file.remark && (
                                        <p className="text-gray-600 text-sm line-clamp-2 italic">
                                            &quot;{file.remark}&quot;
                                        </p>
                                    )}

                                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 font-medium">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="text-blue-400" />
                                            {file.teacherName}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-blue-400" />
                                            {new Date(file.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="shrink-0">
                                    <button
                                        onClick={() => handleDownload(file.fileUrl, file.fileName)}
                                        className="flex items-center gap-2 bg-gray-50 text-gray-800 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm active:scale-95"
                                    >
                                        <FaFileDownload />
                                        Download
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* System Info */}
                <div className="mt-12 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                    <FaInfoCircle className="text-blue-500 mt-1 shrink-0" />
                    <p className="text-sm text-blue-700 font-medium">
                        Files are stored securely. If a download doesn't start automatically,
                        ensure that your browser allows popups and check your downloads folder.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SharedFiles;