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
import Notification from "../Notification";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const basePicUrl = "http://localhost:3000/images";

  

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleProfileModal = () => setProfileModalOpen(!profileModalOpen);

  const handleLogout = () => logout();

  return (
    <>
      <nav className="h-16 text-zinc-900 border-b w-full border-gray-800 bg-white flex items-center justify-between px-2">
        {/* Search Section */}
        <div className="search">
          <button
            className="flex items-center gap-2 hover:bg-sky-300 bg-sky-200 px-3 py-2 rounded-md ease .3 transition"
            onClick={toggleDrawer}
          >
            <IoSearch className="inline" />
            <span className="hidden sm:flex">Search User</span>
          </button>
        </div>

        {/* Logo */}
        <Logo />

        {/* Right Section */}
        <div className="flex items-center justify-center relative">
          {/* Notifications */}
         <Notification />

          {/* Profile Dropdown */}
          <div className="relative dropdown">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-sm font-medium rounded-md px-2"
            >
              <img
                className="w-8 h-8 me-2 rounded-full"
                src={
                  `${basePicUrl}/${user?.pic}` ||
                  `${basePicUrl}/default-avatar.png`
                }
                alt="User"
              />
              <IoIosArrowDown className="font-bold text-lg hidden sm:flex" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 text-zinc-700 bg-zinc-100 divide-y divide-zinc-300 rounded-lg shadow w-44 z-10">
                <button
                  onClick={toggleProfileModal}
                  className="block px-4 py-2 text-sm  hover:bg-sky-100 w-full text-left"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm  hover:bg-sky-100 w-full text-left"
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
