import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useLogout } from "../../hooks/useLogout";
import toast from "react-hot-toast";
import { getAllComponents } from "../../services/componentService";
import Logo from "./Logo";
import Dropdown from "./Dropdown";
import AuthButtons from "./AuthButtons";
import { FaBars, FaTimes } from "react-icons/fa"; // Icons for the hamburger menu

const Navbar = () => {
  const { user, isLoading } = useAuthContext();  
  const { logout } = useLogout();

  const [components, setComponents] = useState([]);
  const [isCreateDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [isComponentsDropdownOpen, setComponentsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  const mobileMenuRef = useRef(null); // Ref for the mobile menu

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await getAllComponents();
        setComponents(data.components);
      } catch (error) {
        toast.error("Failed to load components");
      }
    };

    fetchComponents();
  }, []);

  const handleLogout = () => {
    logout();
  };

  // Toggle the mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) {
      document.body.classList.add("overflow-hidden"); // Disable scrolling
    } else {
      document.body.classList.remove("overflow-hidden"); // Enable scrolling
    }
  };

  // Close the mobile menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setMobileMenuOpen(false);
        document.body.classList.remove("overflow-hidden"); // Enable scrolling when closed
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="h-16 text-white border-b border-gray-800 sm:border-none bg-zinc-900 flex items-center justify-between px-8">
      <Logo />

      {/* Desktop Menu */}
      <div className="hidden md:flex links items-center relative">
        {/* Desktop Menu - Admin Link */}
        {user?.role === 1 && (
          <Link
            to="/userInfo"
            className="text-white font-normal px-4 text-xl duration-200 ease hover:text-teal-400"
          >
            Manage Users
          </Link>
        )}
        <Dropdown
          title="+ Create"
          isOpen={isCreateDropdownOpen}
          setIsOpen={setCreateDropdownOpen}
          components={components}
          userRole={user?.role}
          isCreate="true"
          color="teal-400"
        />
        <Link
          to="/challengePage"
          className="text-white font-normal px-4 text-xl duration-200 ease hover:text-teal-400"
        >
          Challenges
        </Link>
        <Dropdown
          title="Elements"
          isOpen={isComponentsDropdownOpen}
          setIsOpen={setComponentsDropdownOpen}
          components={components}
          to={"/ui-components"}
        />
        <Link
          to={`/profile-page/${user?._id}`}
          className="text-white font-normal px-4 text-xl duration-200 ease hover:text-teal-400"
        >
          {isLoading
            ? "Loading..."
            : user && user.name
            ? user?.name.split(" ")[0]
            : "Profile"}
        </Link>
        <AuthButtons user={user} handleLogout={handleLogout} />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button
          onClick={toggleMobileMenu}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <FaTimes className="text-lg sm:xl" />
          ) : (
            <FaBars className="text-lg sm:xl" />
          )}
        </button>
      </div>

      {/* Sliding Mobile Menu */}
      <div
        ref={mobileMenuRef} // Assign ref to the mobile menu
        className={`fixed top-16 right-0 h-full w-3/4 bg-zinc-900 bg-opacity-95 md:hidden text-white transition-transform duration-300 ease-in-out z-50 ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center py-4">

{/* Mobile Menu - Admin Link */}
{user?.role === 1 && (
  <Link
    to="/userInfo"
    onClick={toggleMobileMenu}
    className="text-white font-normal px-4  text-xl"
  >
    Manage Users
  </Link>
)}
          <Link
            to="/challengePage"
            onClick={toggleMobileMenu}
            className="text-white font-normal px-4 py-4 text-xl"
          >
            Challenges
          </Link>
          <Link
            to="/ui-components"
            onClick={toggleMobileMenu}
            className="text-white font-normal px-4  text-xl"
          >
            Elements
          </Link>
          <Link
            to={`/profile-page/${user?.id}`}
            onClick={toggleMobileMenu}
            className="text-white font-normal px-4 py-4 text-xl"
          >
            {isLoading
              ? "Loading..."
              : user && user.name
              ? user?.name.split(" ")[0]
              : "Profile"}
          </Link>
          <AuthButtons user={user} handleLogout={handleLogout} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
