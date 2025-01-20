import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { IoClose } from "react-icons/io5";
import axiosInstance from "../../utils/axiosConfig";
import toast from "react-hot-toast";
import { ChatState } from "../../context/ChatProvider";

const CreateGroupModel = ({ toggleCreateGroupModal }) => {
  const { user } = useAuthContext();
  const basePicUrl = "http://localhost:3000/images";

  const { chats, setChats ,setLoadingChats} = ChatState();

  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

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
      setSearchResults(data.users);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupChatName || !selectedUsers) {
      toast.error("Please fill All fields");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Creating group...");

    try {
      setLoadingChats(true)
      const { data } = await axiosInstance.post(`/api/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });

      setChats([data.fullGroupChat, ...chats]);
      toggleCreateGroupModal();
      // Replace loading toast with success message
      toast.success("New Group Chat Created!!!", { id: loadingToast });
    } catch (error) {
      // Replace loading toast with error message
      toast.error("Problem in Creating Group Chat!!!", { id: loadingToast });
      console.log(error);
    }
    finally{
      setLoadingChats(false)
    }
  };

  const handleDelete = (userToRemove) => {
    setSelectedUser(
      selectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.success("User Already added");
      return;
    }

    setSelectedUser([...selectedUsers, userToAdd]);
    return;
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={toggleCreateGroupModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg py-2 px-6 w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl text-center border-b py-4 font-bold">
          Create Group Chat
        </h2>
        <button
          onClick={toggleCreateGroupModal}
          className="rounded-full hover:bg-zinc-300 p-2 absolute right-1 top-1"
        >
          <IoClose className="text-lg" />
        </button>

        <form className="max-w-md mt-4 mx-auto">
          <div className="relative z-0 w-full mb-5 group">
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
          {/* Selected Users */}
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedUsers.map((user, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-zinc-200 text-zinc-900 px-3 py-1 rounded-lg"
              >
                <span className="text-sm font-medium">{user?.name}</span>
                <button
                  onClick={() => handleDelete(user)}
                  className="text-red-500 hover:text-red-700"
                >
                  <IoClose />
                </button>
              </div>
            ))}
          </div>

          {/* Render searched users */}
          {loading
            ? "Loading..."
            : searchResults?.length > 0 && (
                <ul className="max-w-md divide-y mb-2 divide-gray-400">
                  {searchResults?.slice(0, 4).map((user, index) => (
                    <li
                      key={index}
                      className="pt-1 sm:pb-2 cursor-pointer hover:bg-zinc-200"
                      onClick={(e) => handleGroup(user)}
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
            className="bg-zinc-900 text-white px-4 py-2 w-full rounded-lg mb-5 ease duration-200"
            onClick={(e) => handleSubmit(e)}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModel;
