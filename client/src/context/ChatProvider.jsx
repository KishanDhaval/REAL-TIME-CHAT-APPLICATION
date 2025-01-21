import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosConfig"; // Adjust path based on your structure
import { useAuthContext } from "../hooks/useAuthContext";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true); // Optional loading state
  const [ selectedChat , setSelectedChat] = useState("")
  const {user} = useAuthContext()
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await axiosInstance.get("/api/chat"); // Fetch chats
        setChats(data.chats || []); // Update state with chats
        localStorage.setItem("userChats", JSON.stringify(data.chats)); // Save to local storage
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
      finally{
        setLoadingChats(false)
      }
    };

    fetchChats();
  }, [user]);

  return (
    <ChatContext.Provider value={{ chats, setChats, loadingChats,setLoadingChats ,selectedChat, setSelectedChat }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
