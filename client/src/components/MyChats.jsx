import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { useAuthContext } from "../hooks/useAuthContext";
import CreateGroupModel from "./layouts/CreateGroupModel";
import { FiPlus } from "react-icons/fi";
import { getSenders } from "../utils/chatLogics";
import SearchLoader from "./layouts/SearchLoader";

const basePicUrl = "http://localhost:3000/images"; // Replace with your actual base URL

const MyChats = ({fetchAgain}) => {
  const { chats, loadingChats, selectedChat, setSelectedChat ,notification, setNotification } = ChatState();
  const { user } = useAuthContext();
  const [createGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  
  const toggleCreateGroupModal = () =>
    setCreateGroupModalOpen(!createGroupModalOpen);

  return (
    <div
      className={`p-4 border h-full border-gray-300 bg-zinc-100`}
    >
      <div className="header w-full flex justify-between items-center">
        <h2 className="text-lg font-bold mb-4">My Chats</h2>
        <button
          type="button"
          onClick={toggleCreateGroupModal}
          className="font-medium rounded-lg text-md px-4 py-2 flex items-center gap-2 bg-zinc-800 text-white hover:bg-zinc-700"
        >
          Create Group <FiPlus className="inline" />
        </button>
      </div>
      {chats.length > 0 && !loadingChats ? (
        <ul className="max-w-md divide-y mt-2 text-zinc-800 divide-gray-200">
          {chats.map((chat, index) => (
            <li
              key={index}
              className={`pb-3 pt-3 sm:pb-4 px-2 cursor-pointer text-zinc-800 hover:bg-zinc-300 ${
                selectedChat && selectedChat._id === chat._id
                  ? "bg-zinc-300"
                  : ""
              }`}
              onClick={() =>{
                setSelectedChat(chat);
                setNotification(notification.filter((n)=> n.chat._id !== chat._id))
              } }
            >
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
                      // :chat?.users?.length > 0 && getSenders(user , chat?.users)}
                      :getSenders(user , chat?.users)}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.latestMessage?.content || "No messages yet"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <SearchLoader/>
      )}

      {/* Profile Modal */}
      {createGroupModalOpen && (
        <CreateGroupModel toggleCreateGroupModal={toggleCreateGroupModal} />
      )}
    </div>
  );
};

export default MyChats;
