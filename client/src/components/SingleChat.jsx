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
import { io } from "socket.io-client";
import TypingIndicator from "./layouts/TypingIndicator";

const ENDPOINT = "http://localhost:3000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const basePicUrl = "http://localhost:3000/images"; // Replace with your actual base URL

  const { user } = useAuthContext();
  const {
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    setChats,
    chats,
  } = ChatState();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [groupEditModelOpen, setgroupEditModelOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const toggleProfileModal = () => setProfileModalOpen(!profileModalOpen);
  const toggleGroupEditModal = () => setgroupEditModelOpen(!groupEditModelOpen);

  useEffect(() => {
    if (!socket) {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }

    // return () => {
    //   if (socket) {
    //     socket.disconnect();
    //   }
    // };
  }, [user]);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/api/message/${selectedChat._id}`
      );

      setMessages(data); // Update the messages state

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages(); // Call the fetch function whenever the selected chat changes

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // Add the new message to the notification list if not already included
        if (
          !notification.find((notif) => notif._id === newMessageReceived._id)
        ) {
          setNotification([newMessageReceived, ...notification]);

          // Update chats by modifying the last message of the relevant chat
          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat._id === newMessageReceived.chat._id
                ? { ...chat, lastMessage: newMessageReceived.content }
                : chat
            )
          );
        }
      } else {
        // Add the message to the selected chat's message list
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, [socket, messages]);

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
        socket.emit("stop typing", selectedChat._id);
        const { data } = await axiosInstance.post(`/api/message/`, {
          content: newMessage,
          chatId: selectedChat._id,
        });

        // Replace the temporary message with the backend response
        setMessages((prevMessages) =>
          prevMessages.map((msg) => (msg._id === tempMessage._id ? data : msg))
        );
        socket.emit("new message", data);
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

    // typing indicator logic
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
          <div className="chatBox bg-sky-00 border rounded-t w-full flex flex-col justify-end flex-grow p-4 overflow-y-auto">
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
                        className={`${
                          m.sender._id === user._id
                            ? "bg-[#364F6B] text-white"
                            : "bg-[#DDE6ED] text-[#27374D]"
                        } rounded-[20px] p-[5px_15px] max-w-[75%]`}
                        style={{
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
          <div className="">
            <TypingIndicator isTyping={isTyping} />
            {/* {isTyping ? <TypingIndicator/> : <></>} */}
            <form className="inputBox flex items-center w-full bg-sky-00 p-3 border-r rounded-b border-l border-b">
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
