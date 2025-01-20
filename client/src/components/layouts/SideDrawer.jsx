import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import axiosInstance from "../../utils/axiosConfig";
import SearchLoader from "./SearchLoader"; // Assuming a loader component is defined
import { ChatState } from "../../context/ChatProvider";

const SideDrawer = ({ drawerOpen, toggleDrawer, onChatAccess }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [chatCreateLoading, setChatCreateLoading] = useState(false);
  const basePicUrl = "http://localhost:3000/images";
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
      if (!chats.some((chat) => chat._id === data._id)) {
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
      className={`fixed top-0 left-0 z-50 w-1/4 h-full bg-zinc-800 text-white shadow-lg transform transition-transform ${
        drawerOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h3 className="text-lg font-semibold">Search User</h3>
        <button
          onClick={toggleDrawer}
          className="text-gray-400 hover:text-gray-200"
        >
          <RxCross2 className="text-xl" />
        </button>
      </div>
      <div className="p-4 max-w-md mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IoSearch className="inline" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search users..."
            required
          />
          <button
            onClick={handleSearch}
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Go
          </button>
        </div>

        {searchLoading ? (
          <SearchLoader /> // Loader component for search results
        ) : searchResults.length > 0 ? (
          <ul className="max-w-md divide-y mt-2 divide-gray-200 dark:divide-gray-700">
            {searchResults.map((user, index) => (
              <li
                key={index}
                className="pb-3 pt-3 sm:pb-4 cursor-pointer hover:bg-gray-700"
                onClick={(e) => handleUserClick(e ,user._id)}
              >
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="flex-shrink-0">
                    <img
                      className="w-8 h-8 rounded-full"
                      src={
                        `${basePicUrl}/${user?.pic}` ||
                        `${basePicUrl}/default-avatar.png`
                      }
                      alt="User Avatar"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-gray-400">No users found</p>
        )}
      </div>
    </div>
  );
};

export default SideDrawer;
