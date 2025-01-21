import React, { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { ChatState } from "../context/ChatProvider";
import { FaArrowLeft } from "react-icons/fa";
import {
  getSenders,
  getSendersFull,
  isLastMessage,
  isSameSenderMargin,
  isSameUser,
} from "../utils/chatLogics";
import { FaRegEye } from "react-icons/fa";
import ProfileModel from "./layouts/ProfileModel";
import UpdateGroupChatModel from "./layouts/UpdateGroupChatModel";
import Spinner from "./layouts/Spinner";
import "./SingleChat.css";
import axiosInstance from "../utils/axiosConfig";
import toast from "react-hot-toast";
import ScrollableFeed from "react-scrollable-feed"; // Importing the ScrollableFeed component
import { isSameSender } from "../utils/chatLogics";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const basePicUrl = "http://localhost:3000/images"; // Replace with your actual base URL

  const { user } = useAuthContext();
  const { selectedChat, setSelectedChat } = ChatState();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [groupEditModelOpen, setgroupEditModelOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const toggleProfileModal = () => setProfileModalOpen(!profileModalOpen);
  const toggleGroupEditModal = () => setgroupEditModelOpen(!groupEditModelOpen);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/api/message/${selectedChat._id}`
      );
      console.log(data);

      setMessages(data); // Update the messages state
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(); // Call the fetch function whenever the selected chat changes
  }, [selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (newMessage.trim()) {
      // Temporarily add the message with placeholder sender data
      const tempMessage = {
        _id: Date.now(), // Temporary unique ID
        sender: { _id: user._id, pic: user.pic || "default-avatar.png" },
        content: newMessage,
      };

      setMessages([...messages, tempMessage]);
      setNewMessage("");

      try {
        const { data } = await axiosInstance.post(`/api/message/`, {
          content: newMessage,
          chatId: selectedChat._id,
        });

        // Replace the temporary message with the backend response
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg._id === tempMessage._id ? data : msg))
        );
      } catch (error) {
        // Remove the temporary message if sending fails
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== tempMessage._id)
        );
        toast.error("Something went wrong");
        console.error(error);
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <div className="container h-full min-w-full flex flex-col">
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
          <div className="chatBox bg-zinc-300 w-full flex flex-col justify-end flex-grow p-4 overflow-y-auto">
            {loading ? (
              <div className="h-12 w-12 self-center mb-64">
                <Spinner />
              </div>
            ) : (
              <ScrollableFeed className="space-y-3 w-full hide-scrollbar">
                {messages &&
                  messages.map((m, i) => (
                    <div key={i} className={`flex w-full items-center `}>
                      {/* Avatar Image */}
                      <div className="image w-8 h-8 mr-2">
                        {(isSameSender(messages, m, i, user._id) ||
                          isLastMessage(messages, i, user._id)) && (
                          <img
                            className="w-8 h-8 rounded-full mr-2"
                            src={
                              m.sender._id === user._id
                                ? `${basePicUrl}/${
                                    user.pic || "default-avatar.png"
                                  }`
                                : `${basePicUrl}/${
                                    m.sender.pic || "default-avatar.png"
                                  }`
                            }
                            alt="Chat Avatar"
                          />
                        )}
                      </div>

                      {/* Message Content */}
                      <div
                        style={{
                          backgroundColor:
                            m.sender._id === user._id ? "#18181B" : "white",
                          color: m.sender._id === user._id ? "white" : "#18181B",
                          borderRadius: "20px",
                          padding: "5px 15px",
                          maxWidth: "75%",
                          marginLeft: m.sender._id === user._id ? "auto" : "0",
                          marginRight: m.sender._id !== user._id ? "auto" : "0",
                          marginTop: isSameUser(messages, m, i) ? 3 : 10,
                        }}
                      >
                        <span className="">{m.content}</span>
                      </div>
                    </div>
                  ))}
              </ScrollableFeed>
            )}
          </div>

          {/* Input Box */}
          <form className="inputBox flex items-center w-full bg-zinc-300 p-3 border-t">
            <input
              type="text"
              value={newMessage}
              onChange={typingHandler}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-lg focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="ml-3 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </form>
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
          user={getSendersFull(user, selectedChat?.users)}
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
