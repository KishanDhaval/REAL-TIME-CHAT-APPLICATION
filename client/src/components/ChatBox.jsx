import React from "react";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({fetchAgain , setFetchAgain}) => {
  const { selectedChat } = ChatState();

  return (
    <div
      className={`p-4 border border-gray-300 bg-zinc-100 h-full`}
    >
      <SingleChat  fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  );
};

export default ChatBox;
