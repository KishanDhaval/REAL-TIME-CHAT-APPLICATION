import React from "react";
import { ChatState } from "../context/ChatProvider";

const ChatBox = ({fetchAgain , setFetchAgain}) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`p-4 border border-gray-300 bg-zinc-100 min-h-[calc(100vh-6rem)]`}
    >
      <SingleChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  );
};

export default ChatBox;
