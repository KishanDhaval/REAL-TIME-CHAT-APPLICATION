import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { useAuthContext } from "../hooks/useAuthContext";
import CreateGroupModel from "./layouts/CreateGroupModel";
import { FiPlus } from "react-icons/fi";
import { getSenders } from "../utils/chatLogics";
import SearchLoader from "./layouts/SearchLoader";
import ScrollableFeed from "react-scrollable-feed";
import "./SingleChat.css";

const basePicUrl = "http://localhost:3000/images"; // Replace with your actual base URL

const MyChats = ({ fetchAgain }) => {
  const { chats, loadingChats, selectedChat, setSelectedChat, notification, setNotification } = ChatState();
  const { user } = useAuthContext();
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);

  const toggleCreateGroupModal = () => setCreateGroupModalOpen(!createGroupModalOpen);

  return (
    <div className="p-4 border w-full h-full border-gray-300 bg-zinc-100 flex flex-col">
      {/* Header */}
      <div className="header w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">My Chats</h2>
        <button
          type="button"
          onClick={toggleCreateGroupModal}
          className="font-medium rounded-lg text-md px-4 py-2 flex items-center gap-2 bg-zinc-800 text-white hover:bg-zinc-700"
        >
          Create Group <FiPlus className="inline" />
        </button>
      </div>

      {/* Chat List */}
      {chats.length > 0 && !loadingChats ? (
        <div className="chat-list-container flex-1 overflow-hidden">
          <ScrollableFeed className="space-y-3 w-full hide-scrollbar">
            <ul className="divide-y mt-2 w-full text-zinc-800 divide-gray-200">
              {chats.map((chat, index) => (
                <li
                  key={index}
                  className={`pb-3 pt-3 w-full sm:pb-4 px-2 cursor-pointer text-zinc-800 hover:bg-sky-100 ${
                    selectedChat && selectedChat._id === chat._id
                      ? "bg-sky-100"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedChat(chat);
                    setNotification(notification.filter((n) => n.chat._id !== chat._id));
                  }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={
                          chat?.isGroupChat
                            ? `${basePicUrl}/groupDefault.jpg` // Placeholder for group chats
                            : `${basePicUrl}/${
                                chat?.users?.find((u) => u._id !== user._id)?.pic ||
                                "default-avatar.png"
                              }`
                        }
                        alt="Chat Avatar"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {chat?.isGroupChat
                          ? chat?.chatName
                          : getSenders(user, chat?.users)}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.latestMessage?.content || "No messages yet"}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollableFeed>
        </div>
      ) : (
        <SearchLoader />
      )}

      {/* Profile Modal */}
      {createGroupModalOpen && (
        <CreateGroupModel toggleCreateGroupModal={toggleCreateGroupModal} />
      )}
    </div>
  );
};

export default MyChats;
