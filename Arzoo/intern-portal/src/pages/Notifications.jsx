import { useState } from "react";
import { mockNotifications } from "../data/mockData";

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type) => {
    switch (type) {
      case "task": return "✅";
      case "marks": return "📝";
      case "feedback": return "💬";
      case "deadline": return "⏰";
      default: return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          <p className="text-sm text-gray-500">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="text-green-600 text-sm hover:underline">
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`flex items-start gap-4 p-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 ${!notif.read ? "bg-green-50/50" : ""}`}
            onClick={() => markAsRead(notif.id)}
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg flex-shrink-0">
              {getIcon(notif.type)}
            </div>
            <div className="flex-1">
              <p className={`text-sm ${!notif.read ? "font-medium text-gray-800" : "text-gray-600"}`}>
                {notif.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notif.createdAt).toLocaleString()}
              </p>
            </div>
            {!notif.read && (
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
