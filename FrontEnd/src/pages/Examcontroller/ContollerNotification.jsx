import React, { useState, useEffect, useRef } from 'react'
import { FaBell, FaUser, FaUsers, FaPaperPlane, FaCheckCircle } from 'react-icons/fa'
import axios from 'axios'

const ContollerNotification = () => {
  const [notificationType, setNotificationType] = useState('all') // 'all' or 'specific'
  const [selectedTeachers, setSelectedTeachers] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState('normal') // 'low', 'normal', 'high'
  const [loading, setLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [activeTeachers, setActiveTeachers] = useState([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [reload, setReload] = useState(false)

  const dropdownRef = useRef(null)
  console.log(notifications, "nt");






  // Fecth Notifications from Server 
  useEffect(() => {
    const fetchNotifications = async () => {


      try {
        const response = await axios.get('/getNotifications', {
          withCredentials: true
        })
        console.log(response, "res");

        setNotifications(response.data.notifications || [])
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    fetchNotifications()
  }, [reload])
  // Load teachers from localStorage
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('/getAllTeachers', {
          withCredentials: true, // include cookies/auth headers
        });


        // Assuming response.data is an array of teachers
        const filteredTeachers = response.data?.teachers?.filter(
          teacher => teacher.status === 'active'
        );
        console.log(filteredTeachers, "teachers");

        setActiveTeachers(filteredTeachers);
        console.log('Active Teachers:', filteredTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchTeachers();
  }, []);
  // Handle clicks outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    )
  }

  const handleSelectAll = () => {
    if (selectedTeachers.length === activeTeachers.length) {
      setSelectedTeachers([])
    } else {
      setSelectedTeachers(activeTeachers.map(teacher => teacher.teacherId))
    }
  }

  const getSelectedTeachersText = () => {
    if (selectedTeachers.length === 0) return 'Select teachers...'
    if (selectedTeachers.length === 1) {
      const teacher = activeTeachers.find(t => t.teacherId === selectedTeachers[0])
      return teacher ? `${teacher.name} (${teacher.department})` : 'Select teachers...'
    }
    return `${selectedTeachers.length} teachers selected`
  }



  const sendNotification = async () => {
    if (!title.trim() || !message.trim()) {
      alert('Please fill in both title and message')
      return
    }

    if (notificationType === 'specific' && selectedTeachers.length === 0) {
      alert('Please select at least one teacher')
      return
    }

    setLoading(true)

    try {


      const payload = {
        title: title.trim(),
        message: message.trim(),
        priority,
        type: notificationType,
        recipients: notificationType === 'all' ? 'all' : selectedTeachers,
        TecherIds: notificationType === 'specific' ? selectedTeachers : []
      }

      const response = await axios.post(
        '/createNotification',
        payload,
        {
          headers: {

            'Content-Type': 'application/json'
          },
          withCredentials: true // ✅ important if cookies are HTTP-only
        }
      )


      // Optional: update UI with response data
      const newNotification = response.data.notifications // Assuming response.data contains an array of notifications




      setNotifications(prev => [newNotification, ...prev])

      // Reset form
      setTitle('')
      setMessage('')
      setPriority('normal')
      setSelectedTeachers([])
      setNotificationType('all')

      alert('Notification sent successfully!')

      window.location.reload()

    } catch (error) {
      console.error('Error sending notification:', error)
      alert(
        error.response?.data?.message ||
        'Failed to send notification. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }


  const deleteNotification = async (notificationId) => {
    try {
      console.log(notificationId, "Deleting notification...");

      // Call the backend API
      await axios.delete(`/deleteNotification/${notificationId}`, {
        withCredentials: true, // send cookies if using sessions/auth
      });

      // Update local state immediately using functional update to avoid stale state
      setNotifications(prevNotifications =>
        prevNotifications.filter(n => n._id !== notificationId)
      );

      setReload(!reload);
      console.log("Notification deleted successfully");
    } catch (error) {
      console.error("Error deleting notification:", error.response?.data || error.message);
    }
  };


  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'normal': return 'text-blue-600 bg-blue-100'
      case 'low': return 'text-gray-600 bg-gray-100'
      default: return 'text-blue-600 bg-blue-100'
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 font-out">

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FaBell className="text-blue-600" />
            Send Notifications
          </h1>
          <p className="text-gray-600">
            Send notifications to teachers about important updates and announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Send Notification Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaPaperPlane className="text-blue-600" />
              Compose Notification
            </h2>

            <div className="space-y-6">
              {/* Notification Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Send to:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="notificationType"
                      value="all"
                      checked={notificationType === 'all'}
                      onChange={(e) => setNotificationType(e.target.value)}
                      className="mr-2"
                    />
                    <FaUsers className="mr-2 text-blue-600" />
                    All Teachers
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="notificationType"
                      value="specific"
                      checked={notificationType === 'specific'}
                      onChange={(e) => setNotificationType(e.target.value)}
                      className="mr-2"
                    />
                    <FaUser className="mr-2 text-green-600" />
                    Specific Teachers
                  </label>
                </div>
              </div>

              {/* Teacher Selection Dropdown */}
              {notificationType === 'specific' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Teachers:
                  </label>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-left flex items-center justify-between"
                    >
                      <span className={selectedTeachers.length === 0 ? 'text-gray-500' : 'text-gray-900'}>
                        {getSelectedTeachersText()}
                      </span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-2">
                          <button
                            type="button"
                            onClick={handleSelectAll}
                            className="w-full text-left px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                          >
                            {selectedTeachers.length === activeTeachers.length ? 'Deselect All' : 'Select All'}
                          </button>
                          <div className="border-t border-gray-200 my-2"></div>
                          {activeTeachers.length === 0 ? (
                            <p className="text-sm text-gray-500 p-2">No teachers available</p>
                          ) : (
                            activeTeachers.map(teacher => (
                              <label key={teacher._id} className="flex items-center px-2 py-2 hover:bg-gray-50 cursor-pointer rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedTeachers.includes(teacher._id)}
                                  onChange={() => handleTeacherSelect(teacher._id)}
                                  className="mr-3"
                                />
                                <span className="text-sm text-gray-700">
                                  {teacher.name} ({teacher.department})
                                </span>
                              </label>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  {selectedTeachers.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      {selectedTeachers.length} teacher{selectedTeachers.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              )}

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority:
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="normal">Normal Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter notification title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message:
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Send Button */}
              <button
                onClick={sendNotification}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Notification
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sent Notifications History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FaBell className="text-blue-600" />
              Sent Notifications
            </h2>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No notifications sent yet.</p>
              ) : (
                notifications.flat().map(notification => (
                  <div key={notification._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 line-clamp-1">{notification.title} </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex flex-col gap-1 text-xs text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="font-medium">
                              To: {notification.type === 'all' ? 'All Teachers' :
                                notification.teacherIds?.map(t => t.name).join(', ') || '0 Teachers'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span>{new Date(notification.updatedAt).toLocaleString()}</span>
                            {notification.type === 'specific' && (
                              <span>{notification.teacherIds?.length || 0} Recipients</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete notification"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContollerNotification
