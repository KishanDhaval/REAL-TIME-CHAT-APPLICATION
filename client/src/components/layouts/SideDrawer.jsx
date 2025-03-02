import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../utils/axiosConfig";
import SearchLoader from "./SearchLoader"; // Assuming a loader component is defined
import { ChatState } from "../../context/ChatProvider";
import { basePicUrl } from "../../utils/axiosConfig";

const SideDrawer = ({ drawerOpen, toggleDrawer, onChatAccess }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatCreateLoading, setChatCreateLoading] = useState(false);
  const { chats, setChats , setSelectedChat } = ChatState(); // Access context

  const handleSearch = async () => {
    try {
      setSearchLoading(true); // Start loader
      const { data } = await axiosInstance.get(
        `/api/auth/users?search=${searchQuery}`
      );
      
      setSearchResults(data?.users || []); 
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]); // Clear results on error
    } finally {
      setSearchLoading(false); // Stop loader
    }
  };
  
  const handleUserClick = async (e ,userId) => {
    e.preventDefault();
    try {
      setChatCreateLoading(true)
      const { data } = await axiosInstance.post("/api/chat", { userId });
      if (!chats.some((chat) => chat._id === data?._id)) {
        setChats([data, ...chats]); // Add to context state
      }
      setSelectedChat(data)
      toggleDrawer();
    } catch (error) {
      console.error("Error accessing chat:", error);
    }
    finally{
      setChatCreateLoading(false)
    }
  };
  return (
    <div
      className={`fixed top-0 left-0 z-50 w-4/5 sm:w-1/2 md:w-1/3 lg:w-1/4 h-full bg-zinc-100 text-zinc-800 shadow-lg transform transition-transform ${
        drawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h3 className="text-lg font-semibold">Search User</h3>
        <button
          onClick={toggleDrawer}
          className="text-zinc-400 hover:text-zinc-300 ease transition"
        >
          <RxCross2 className="text-xl" />
        </button>
      </div>
  
      <div className="p-4 max-w-1/2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearch className="inline text-sky- text-lg" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="default-search"
            className="block w-full p-3 sm:p-4 pl-10 text-sm text-gray-900 outline-none border rounded-lg bg-gray-50 border-gray-300 placeholder-gray-400"
            placeholder="Search users..."
            required
          />
          <button
            onClick={handleSearch}
            className="text-white absolute right-2.5 bottom-2 bg-zinc-800 hover:bg-zinc-700 transition ease outline-none rounded-lg text-sm px-3 sm:px-4 py-2"
          >
            Go
          </button>
        </div>
  
        {searchLoading ? (
          <SearchLoader />
        ) : searchResults.length > 0 ? (
          <ul className="w-full divide-y mt-2 divide-zinc-300">
            {searchResults.map((user, index) => (
              <li
                key={index}
                className="pb-3 px-2 pt-3 sm:pb-4 cursor-pointer hover:bg-sky-100"
                onClick={(e) => handleUserClick(e, user._id)}
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      className="w-10 h-10 sm:w-8 sm:h-8 rounded-full"
                      src={
                        `${basePicUrl}/${user?.pic}` ||
                        `${basePicUrl}/default-avatar.png`
                      }
                      alt="User Avatar"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-zinc-700">
                      {user.name}
                    </p>
                    <p className="text-xs sm:text-sm truncate text-zinc-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-400 text-center">No users found</p>
        )}
      </div>
    </div>
  );
}
export default SideDrawer