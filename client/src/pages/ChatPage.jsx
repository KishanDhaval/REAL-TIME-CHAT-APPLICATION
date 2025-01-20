import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../components/layouts/Layout";
import SideDrawer from "../components/layouts/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { ChatState } from "../context/ChatProvider";

const ChatPage = () => {
  const { user } = useAuthContext();
  const { selectedChat } = ChatState();

  const [fetchAgain , setFetchAgain] = useState()

  return (
    <Layout >
      <div className="container min-w-full flex gap-4 justify-between p-4 min-h-[calc(100vh-4rem)] bg-zinc-200">
        {/* MyChats section - visible if there's no selected chat */}
        <div className={` md:w-2/6 w-full ${selectedChat ? "hidden md:block" : "block"}`}>
          {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        </div>

        {/* ChatBox section - visible if there's a selected chat */}
        <div className={`w-full md:w-4/6 ${selectedChat ? "block" : "hidden md:block"}`}>
          {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
