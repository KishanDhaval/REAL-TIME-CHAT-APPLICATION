import { createContext, useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
// import { useHistory } from "react-router-dom";
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const { user } = useAuthContext;

//   const history = useHistory();

//   useEffect(()=>{
//     if(!user){
//         history.push('/')
//     }
//   },[])

  return (
    <ChatContext.Provider value={{user}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
