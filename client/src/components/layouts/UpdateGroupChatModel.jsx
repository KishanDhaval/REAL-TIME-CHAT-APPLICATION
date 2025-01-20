import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { ChatState } from "../../context/ChatProvider";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../../utils/axiosConfig";
import toast from "react-hot-toast";

const UpdateGroupChatModel = ({
  fetchAgain,
  setFetchAgain,
  toggleGroupEditModal,
}) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [renameLoading, setRenameLoading] = useState(false);
  const basePicUrl = "http://localhost:3000/images";

  const { user } = useAuthContext();
  const { selectedChat, setSelectedChat, setLoadingChats, setChats } = ChatState();

  const handleSearch = async (query) => {
    const trimmedQuery = query.trim(); // Trim the input
    setSearch(trimmedQuery);

    if (!trimmedQuery) {
      setSearchResults(null); // Clear search results if input is empty
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.get(
        `/api/auth/users?search=${trimmedQuery}`
      );
      console.log(data.users);
      setSearchResults(data.users);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async(user1) => {
    if(selectedChat.users.find((u)=>u._id === user1._id)){
        toast.success("User Already in group!!!")
        return;
    }

    if(selectedChat.groupAdmin._id !== user._id){
        toast.error("Only admin can add someone!")
        return;
    }

    try {
        setLoading(true)

        const{data} = await axiosInstance.put(`/api/chat/group/add`,{
            chatId : selectedChat._id,
            userId : user1._id
        })

        setSelectedChat(data.added)
        setFetchAgain(!fetchAgain)
    } catch (error) {
        console.log(error);
        toast.error("something went wrong")
    }
    finally{
        setLoading(false)
    }
  };
  const handleRemove = async (userToRemove) => {
    // Only admin or the user themselves can remove a user
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      toast.error("Only the admin can remove someone!");
      return;
    }
  
    try {
      setLoading(true);
  
      // Call the API to remove the user
      const { data } = await axiosInstance.put(`/api/chat/group/remove`, {
        chatId: selectedChat._id,
        userId: userToRemove._id,
      });
  
      if (userToRemove._id === user._id) {
        // If the admin removes themselves, clear the selected chat
        setSelectedChat(null);
        toggleGroupEditModal();
        toast.success("You have left the group.");
      } else {
        // If someone else is removed, update the selected chat with the new group data
        setSelectedChat(data.remove);
        toast.success(`${userToRemove.name} has been removed from the group.`);
      }
  
      // Trigger re-fetch for updated data
      setFetchAgain(!fetchAgain);
  
    } catch (error) {
      console.error("Failed to remove user:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const handleRename = async (e) => {
      e.preventDefault();

    if (!groupChatName) {
      toast.error("Group name cannot be empty!");
      return;
    }

    const loadingToast = toast.loading("Renaming group...");

    try {
      setLoadingChats(true);
      setRenameLoading(true);

      const { data } = await axiosInstance.put(`/api/chat/group/rename`, {
        chatId: selectedChat._id,
        chatName: groupChatName,
      });
      console.log(data);

      // Update the selected chat and chats state
      setSelectedChat(data.updatedChat);
      setFetchAgain(!fetchAgain); // Trigger re-fetch for updated data
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === selectedChat._id
            ? { ...chat, chatName: groupChatName }
            : chat
        )
      );

      // Update the toast to success
      toast.success("Group name updated successfully!", {
        id: loadingToast,
      });
    } catch (error) {
      console.error("Failed to update group name:", error);

      // Update the toast to error
      toast.error("Failed to update group name. Please try again!", {
        id: loadingToast,
      });
    } finally {
      setLoadingChats(false);
      setRenameLoading(false);
    }
};


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={toggleGroupEditModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg py-2 px-3 w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold border-b py-4 text-center">
          {selectedChat?.chatName}
        </h2>
        <button
          onClick={toggleGroupEditModal}
          className="rounded-full absolute right-1 top-1 p-2 hover:bg-zinc-300 "
        >
          {" "}
          <IoClose />
        </button>
        <div className="flex flex-col gap-4 items-center m-4">
          {/* group Users */}
          <div className="flex flex-wrap gap-2">
            {selectedChat?.users?.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-zinc-200 text-zinc-900 px-3 py-1 rounded-lg"
              >
                <span className="text-sm font-medium">{user?.name}</span>
                <button
                  onClick={() => handleRemove(user)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IoClose />
                </button>
              </div>
            ))}
          </div>
          {/* rename user */}
          <form className="w-full flex justify-between gap-2 mt-4 mx-auto">
            <div className="relative z-0 w-5/6  group">
              <input
                className="border-2 border-textColor rounded-md outline-none px-4 py-2 w-full"
                type="text"
                name="name"
                id="name"
                required
                placeholder="Group name..."
                autoComplete="off"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </div>
            <button
              className="bg-zinc-900 text-white px-4 py-2 w-2/6 rounded-lg ease duration-200"
              onClick={(e) => handleRename(e)}
            >
              Rename
            </button>
          </form>
          {/* Search User */}
          <form className="max-w-md mt-4 w-full mx-auto">
            <div className="relative z-0 w-full mb-3 group">
              <input
                className="border-2 border-textColor rounded-md outline-none px-4 py-2 w-full"
                type="text"
                name="users"
                id="users"
                required
                placeholder="Add Users"
                autoComplete="off"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </form>
          {/* Render searched users */}
          {loading
            ? "Loading..."
            : searchResults?.length > 0 && (
                <ul className="w-full divide-y mb-2 divide-gray-400">
                  {searchResults?.slice(0, 4).map((user, index) => (
                    <li
                      key={index}
                      className="pt-1 sm:pb-2 cursor-pointer hover:bg-zinc-200"
                      onClick={(e) => handleAddUser(user)}
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
                          <p className="text-sm font-medium text-gray-700 truncate">
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
              )}

          <button
            className="bg-zinc-900 text-white self-end px-4 py-2  rounded-lg ease duration-200"
            onClick={() => handleRemove(user)}
          >
            Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateGroupChatModel;
