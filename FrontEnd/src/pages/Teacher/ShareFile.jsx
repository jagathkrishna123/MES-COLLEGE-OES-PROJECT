import React, { useState } from 'react';
import axios from 'axios';
import { FaCloudUploadAlt, FaFileAlt, FaCheckCircle, FaTimesCircle, FaPaperPlane } from 'react-icons/fa';

const ShareFile = () => {
    const [subject, setSubject] = useState('');
    const [remark, setRemark] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 20 * 1024 * 1024) {
                setStatus({ type: 'error', message: 'File size must be less than 20MB' });
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setStatus({ type: '', message: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject || !file) {
            setStatus({ type: 'error', message: 'Subject and file are required' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('remark', remark);
        formData.append('sharedFile', file);

        try {
            const response = await axios.post('/shareFile', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setStatus({ type: 'success', message: 'File shared successfully with the Controller!' });
            setSubject('');
            setRemark('');
            setFile(null);
            // Reset file input manually
            document.getElementById('file-upload').value = '';
        } catch (error) {
            console.error('Upload Error:', error);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to share file. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8 font-out">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Share File</h1>
                    <p className="text-gray-600">Securely share documents and remarks with the Exam Controller.</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Subject Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject / Topic <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g., Mathematics - Final Report"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Remark Input */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Remarks / Additional Notes
                                </label>
                                <textarea
                                    value={remark}
                                    onChange={(e) => setRemark(e.target.value)}
                                    placeholder="Any specific instructions for the controller..."
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                                />
                            </div>

                            {/* File Upload Area */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Attachment <span className="text-red-500">*</span>
                                </label>
                                <div
                                    className={`relative border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center cursor-pointer
                    ${file ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
                                    onClick={() => document.getElementById('file-upload').click()}
                                >
                                    <input
                                        id="file-upload"
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                    />

                                    <div className={`p-4 rounded-full mb-4 ${file ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                        {file ? <FaFileAlt size={32} /> : <FaCloudUploadAlt size={32} />}
                                    </div>

                                    <div className="text-center">
                                        {file ? (
                                            <div>
                                                <p className="text-blue-700 font-medium truncate max-w-xs">{file.name}</p>
                                                <p className="text-blue-500 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-gray-700 font-medium">Click to upload or drag and drop</p>
                                                <p className="text-gray-400 text-sm mt-1">PDF, Word, or Images (Max 20MB)</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status Message */}
                            {status.message && (
                                <div className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2
                  ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                                    {status.type === 'success' ? <FaCheckCircle className="shrink-0" /> : <FaTimesCircle className="shrink-0" />}
                                    {status.message}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:scale-[0.98]'}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sharing File...
                                    </>
                                ) : (
                                    <>
                                        <FaPaperPlane className="text-sm" />
                                        Share with Controller
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="mt-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                    Files are encrypted and only accessible by authorized exam controllers
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default ShareFile;