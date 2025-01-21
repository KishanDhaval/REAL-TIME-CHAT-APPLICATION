import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { IoIosNotifications, IoIosArrowDown } from "react-icons/io";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import Logo from "./Logo";
import SideDrawer from "./SideDrawer";
import ProfileModel from "./ProfileModel";
import { ChatState } from "../../context/ChatProvider";
import { getSenders } from "../../utils/chatLogics";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const basePicUrl = "http://localhost:3000/images";

  const { notification, setNotification,setSelectedChat } = ChatState();

  console.log(notification);
  

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleProfileModal = () => setProfileModalOpen(!profileModalOpen);
  const toggleNotification = () => setNotificationOpen(!notificationOpen);

  const handleLogout = () => logout();

  return (
    <>
      <nav className="h-16 text-white border-b w-full border-gray-800 bg-zinc-900 flex items-center justify-between px-2">
        {/* Search Section */}
        <div className="search">
          <button
            className="flex items-center gap-2 hover:bg-zinc-800 px-3 py-2 rounded-md"
            onClick={toggleDrawer}
          >
            <IoSearch className="inline" />
            <span className="hidden sm:flex">Search User</span>
          </button>
        </div>

        {/* Logo */}
        <Logo />

        {/* Right Section */}
        <div className="flex items-center relative">
          {/* Notifications */}
          <div className="relative">
            <button onClick={toggleNotification} className="relative">
              <IoIosNotifications className="text-xl" />
              {notification.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-red-500 rounded-full">
                  {notification.length}
                </span>
              )}
            </button>
            {notificationOpen && (
              <div className="absolute right-0 mt-2 py-2 bg-zinc-700 divide-y  divide-gray-100 rounded-lg shadow w-72 z-10">
                {notification.length ? (
                  notification.map((note, idx) => (
                    <div
                      key={idx}
                      onClick={()=>{
                        setSelectedChat(note.chat)
                        setNotification(notification.filter((n)=> n !== note))
                        setNotificationOpen(!notificationOpen)
                      }}
                      className="flex items-center p-2 cursor-pointer hover:bg-zinc-600"
                    >
                      {note.chat.isGroupChat
                        ? `New Message in ${note.chat.chatName}`
                        : `New Message from ${getSenders(user , note.chat.users)}`}
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-sm text-gray-400">No notifications</p>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative dropdown">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-sm font-medium rounded-md px-4 py-1"
            >
              <img
                className="w-8 h-8 me-2 rounded-full"
                src={
                  `${basePicUrl}/${user?.pic}` ||
                  `${basePicUrl}/default-avatar.png`
                }
                alt="User"
              />
              <IoIosArrowDown className="font-bold text-lg" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 bg-zinc-700 divide-y divide-gray-100 rounded-lg shadow w-44 z-10">
                <button
                  onClick={toggleProfileModal}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 w-full text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 w-full text-left"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {profileModalOpen && (
        <ProfileModel toggleProfileModal={toggleProfileModal} user={user} />
      )}

      {/* Left Drawer */}
      {drawerOpen && (
        <SideDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
      )}
    </>
  );
};

export default Navbar;
