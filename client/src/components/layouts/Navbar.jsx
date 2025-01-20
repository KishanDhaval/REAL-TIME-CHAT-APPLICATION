import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoIosNotifications, IoIosArrowDown } from "react-icons/io";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import { RxCross2 } from "react-icons/rx";
import Logo from "./Logo";
import axiosInstance from "../../utils/axiosConfig";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleLogout = () => {
    logout();
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearch = async (e) => {
    try {
      const { data } = await axiosInstance.get(
        `/api/auth/users?search=${searchQuery}`
      );
      console.log(data);
      setSearchResults(data); // Assuming response data contains search results
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="h-16 text-white border-b border-gray-800 sm:border-none bg-zinc-900 flex items-center justify-between px-8">
        {/* Search Section */}
        <div className="search">
          <button
            className="flex justify-center items-center gap-2 hover:bg-zinc-800 px-3 py-2 rounded-md"
            onClick={toggleDrawer}
          >
            <IoSearch className="inline" />
            <span className="hidden sm:flex text-mg">Search User</span>
          </button>
        </div>

        {/* Logo */}
        <Logo />

        {/* Right Section */}
        <div className="hidden md:flex links items-center relative">
          <IoIosNotifications className="text-xl me-4" />

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center text-sm font-medium rounded-md px-4 py-1"
            >
              <img
                className="w-8 h-8 me-2 rounded-full"
                src={`http://localhost:3000/images/${user?.pic}`}
                alt="User"
              />
              <IoIosArrowDown className="font-bold text-lg" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-zinc-700 divide-y divide-gray-100 rounded-lg shadow w-44 z-10">
                <button
                  onClick={toggleModal}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
                >
                  {user.name}
                </button>
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Left Drawer */}
      {drawerOpen && (
        <div
          className="fixed top-0 left-0 z-50 w-1/4 h-full bg-zinc-800 text-white shadow-lg transition-transform transform "
          style={{
            transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          }}
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
              <label
                for="default-search"
                class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <IoSearch className="inline" />
                </div>
                <input
                  type="search"
                  id="default-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search Mockups, Logos..."
                  required
                />
                <button
                  type="submit"
                  onClick={handleSearch}
                  class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            {/* Display search results */}
            {searchResults.length > 0 && (
              <div className="mt-4 text-gray-300">
                <ul>
                  {searchResults.map((user, index) => (
                    <li key={index}>{user.name}</li> // Modify based on actual data structure
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
