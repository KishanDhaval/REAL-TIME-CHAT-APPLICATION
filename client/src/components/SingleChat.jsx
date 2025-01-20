import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { ChatState } from "../context/ChatProvider";
import { FaArrowLeft } from "react-icons/fa";
import { getSenders, getSendersFull } from "../utils/chatLogics";
import { FaRegEye } from "react-icons/fa";
import ProfileModel from "./layouts/ProfileModel";
import UpdateGroupChatModel from "./layouts/UpdateGroupChatModel";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user } = useAuthContext();
  const { selectedChat, setSelectedChat } = ChatState();
  const [profileModalOpen, setProfileModalOpen] = useState(false); // Fix state initialization
  const [groupEditModelOpen, setgroupEditModelOpen] = useState(false); // Fix state initialization

  const toggleProfileModal = () => setProfileModalOpen(!profileModalOpen);
  const toggleGroupEditModal = () => setgroupEditModelOpen(!groupEditModelOpen);
    
  return (
    <>
      {selectedChat ? (
        <div className="container h-full w-full flex flex-col">
          <div className="heading flex mb-4 px-2 items-center justify-between">
            <button
              className="flex md:hidden"
              onClick={() => setSelectedChat("")}
            >
              <FaArrowLeft />
            </button>
            {selectedChat?.isGroupChat ? (
              <>
                {selectedChat?.chatName.toUpperCase()}
                <button onClick={toggleGroupEditModal}>
                  <FaRegEye />
                </button>
              </>
            ) : (
              <>
                {getSenders(user, selectedChat?.users)}
                <button onClick={toggleProfileModal}>
                  <FaRegEye />
                </button>
              </>
            )}
          </div>

          {/* Chat Box */}
          <div className="chatBox bg-zinc-300 flex flex-col justify-end flex-grow p-4">
            {/* Example of rendering messages */}
            {/* {selectedChat.messages.map((msg) => (
              <div key={msg._id}>
                <p>{msg.sender.name}: {msg.content}</p>
              </div>
            ))} */}
          </div>
        </div>
      ) : (
        <div className="text-center mt-80 text-3xl text-zinc-400">
          Click on a user to start chatting
        </div>
      )}

      {/* Profile Modal for Chat User */}
      {profileModalOpen && (
        <ProfileModel
          toggleProfileModal={toggleProfileModal}
          user={getSendersFull(user, selectedChat?.users)} // Make sure this is the full user object
        />
      )}
      {groupEditModelOpen && (
        <UpdateGroupChatModel
          toggleGroupEditModal={toggleGroupEditModal}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
        />
      )}
    </>
  );
};

export default SingleChat;
