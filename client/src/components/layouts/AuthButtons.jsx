import React from 'react';
import { Link } from 'react-router-dom';
import { MdLogout } from "react-icons/md";

const AuthButtons = ({ user, handleLogout }) => {
  return (
    <>
      {!user ? (
        <Link to="/register" className="text-white font-normal px-4 text-xl duration-200 ease hover:text-teal-400">
          Sign up
        </Link>
      ) : (
        <button
          onClick={handleLogout}
          className="text-white font-normal px-4 text-xl duration-200 ease hover:text-red-600"
        >
          <MdLogout />
        </button>
      )}
    </>
  );
};

export default AuthButtons;
