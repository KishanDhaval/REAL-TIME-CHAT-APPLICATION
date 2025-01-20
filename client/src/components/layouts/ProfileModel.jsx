import React from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { IoClose } from "react-icons/io5";
const ProfileModel = ({ toggleProfileModal }) => {
  const basePicUrl = "http://localhost:3000/images";

  const { user } = useAuthContext();
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={toggleProfileModal}
    >
      <div
        className="bg-white rounded-lg shadow-lg py-2 px-4 w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold border-b py-4 text-center">
          {user?.name}
        </h2>
        <button
          onClick={toggleProfileModal}
          className="rounded-full absolute right-1 top-1 p-2 hover:bg-zinc-300 "
        >
          <IoClose />
        </button>
        <div className="flex flex-col gap-4 items-center m-4">
          <img
            className="w-28 h-28 rounded-full mr-4"
            src={
              `${basePicUrl}/${user?.pic}` || `${basePicUrl}/default-avatar.png`
            }
            alt="User"
          />
          <div>
            <p className="text-md text-gray-600">{user?.email || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModel;
