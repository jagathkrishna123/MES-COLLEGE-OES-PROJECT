import React, { useState, useEffect } from 'react'
import { FaBell, FaCheckCircle, FaClock, FaUser, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'
import axios from 'axios'
const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState('all') // 'all', 'unread', 'read'
  const [teacherId, setTeacherId] = useState("")
  // console.log(notifications, "not");
  // console.log(teacherId, "teacherId12");
  // console.log(filter, "filter");

  useEffect(() => {

    loadNotifications()

  }, [])

  // Redirect if not logged in


  const loadNotifications = async () => {
    try {
      const response = await axios.get(
        `/getNotifications`, // adjust URL if needed
        {
          withCredentials: true, // 👈 send cookies/session
        }
      );


      // If you want to filter by currentTeacherId on the client (optional)
      const currentTeacherIds = [
        ...new Set(response.data?.notifications?.map((notif) => notif.teacherId))
      ];
      setTeacherId(currentTeacherIds)

      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // showMessage("❌ Failed to load notifications.", "error");
    }
  };


  const markAsRead = async (notificationId) => {
    try {
      // Send update to server
      const response = await axios.put(
        `/updateNotification/${notificationId}`,
        {}, // No need to send readBy; backend handles it
        { withCredentials: true } // Include cookies
      );

      const updatedNotification = response.data.notification;

      // Update local state
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n._id === updatedNotification._id ? updatedNotification : n
        )
      );

    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };



  const markAllAsRead = async () => {
    try {
      const res = await axios.put(
        "/updateAllNotification",
        {},
        { withCredentials: true }
      );

      console.log(res, "resUpdate");

      // adjust URL to your route

      // After backend updates, update UI state
      const updatedNotifications = notifications.map(n => ({
        ...n,
        readBy: [...(n.readBy || []), teacherId],
        status: "read"
      }));

      setNotifications(updatedNotifications);

    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') {
      // Return true if status is "unread"
      return notification.status === "unread";
    }

    if (filter === 'read') {
      // Return true if status is "read"
      return notification.status === "read";
    }

    // If no filter or filter is "all", return all notifications
    return true;
  });



  console.log(filteredNotifications, "fil");

  const unreadCount = notifications.filter(n => n.status === "unread").length;



  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <FaExclamationTriangle className="text-red-500" />
      case 'normal': return <FaInfoCircle className="text-blue-500" />
      case 'low': return <FaInfoCircle className="text-gray-500" />
      default: return <FaInfoCircle className="text-blue-500" />
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'normal': return 'border-l-blue-500 bg-blue-50'
      case 'low': return 'border-l-gray-500 bg-gray-50'
      default: return 'border-l-blue-500 bg-blue-50'
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 font-out">

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FaBell className="text-blue-60 0" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-gray-600">
                Stay updated with important announcements and messages from the Exam Controller.
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead(teacherId)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaCheckCircle />
                Mark All Read
              </button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex bg-white rounded-lg p-1 border border-gray-200">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'read', label: 'Read', count: notifications.length - unreadCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${filter === key
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FaBell className="text-gray-400 text-4xl mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {filter === 'unread' ? 'No unread notifications' :
                  filter === 'read' ? 'No read notifications' :
                    'No notifications yet'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'All caught up!' :
                  filter === 'read' ? 'Read notifications will appear here' :
                    'Notifications from the Exam Controller will appear here'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => {
              const isRead = notification.readBy?.includes(teacherId)

              return (
                <div
                  key={notification._id}
                  className={`bg-white rounded-xl shadow-sm border-l-4 p-6 transition-all duration-200 hover:shadow-md ${getPriorityColor(notification.priority)
                    } ${!isRead ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getPriorityIcon(notification.priority)}
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        {!isRead && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <FaUser className="text-gray-400" size={14} />
                          <span>From: Controller</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-gray-400" size={14} />
                          <span>{new Date(notification.
                            createdAt
                          ).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {!isRead && notification.status === "unread"&& (
                      <button
                        onClick={() => markAsRead(notification._id)}
                        className="ml-4 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <FaCheckCircle size={14} />
                        Mark Read
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </div>
        )}
      </div>
    </div>
  )
}

export default Notification
