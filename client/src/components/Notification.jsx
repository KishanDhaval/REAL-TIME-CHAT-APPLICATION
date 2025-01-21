import React, { useState } from "react";
import { IoIosNotifications } from "react-icons/io";
import { ChatState } from "../context/ChatProvider";
import { getSenders } from "../utils/chatLogics";
import { useAuthContext } from "../hooks/useAuthContext";

const Notification = () => {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const { notification, setNotification, setSelectedChat } = ChatState();
  const toggleNotification = () => setNotificationOpen(!notificationOpen);
    const {user} = useAuthContext()
  return (
    <div className="relative self-end">
      <button onClick={toggleNotification} className="relative">
        <IoIosNotifications className="text-2xl text-sky-500" />
        {notification.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-red-500 rounded-full">
            {notification.length}
          </span>
        )}
      </button>
      {notificationOpen && (
        <div className="absolute right-0 mt-2 py-2 bg-zinc-100 divide-y  divide-gray-100 rounded-lg shadow w-72 z-10">
          {notification.length ? (
            notification.map((note, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedChat(note.chat);
                  setNotification(notification.filter((n) => n !== note));
                  setNotificationOpen(!notificationOpen);
                }}
                className="flex items-center p-2 cursor-pointer hover:bg-sky-100"
              >
                {note.chat.isGroupChat
                  ? `New Message in ${note.chat.chatName}`
                  : `New Message from ${getSenders(user, note.chat.users)}`}
              </div>
            ))
          ) : (
            <p className="p-2 text-sm text-gray-400">No notifications</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
