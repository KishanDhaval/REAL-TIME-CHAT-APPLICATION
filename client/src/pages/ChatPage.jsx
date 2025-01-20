import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Layout from "../components/layouts/Layout";
import SideDrawer from "../components/layouts/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";

const ChatPage = () => {
  const { user } = useAuthContext();

  return <Layout className="min-h-screen">
    <div className="min-h-[calc(100vh-4rem)]">
        <div className="container flex justify-between w-full p-2">
            {user && <MyChats/>}
            {user && <ChatBox/>}
        </div>
    </div>
  </Layout>;
};

export default ChatPage;
