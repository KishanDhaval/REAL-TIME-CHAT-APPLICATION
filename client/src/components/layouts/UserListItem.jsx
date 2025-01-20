import React from "react";

const UserListItem = ({}) => {
  return (
    <>
      { searchResults.length > 0 ? (
        <ul className="max-w-md divide-y mt-2 divide-gray-200 dark:divide-gray-700">
          {searchResults.map((user, index) => (
            <li
              key={index}
              className="pb-3 pt-3 sm:pb-4 cursor-pointer hover:bg-gray-700"
              onClick={(e) => handleUserClick(e, user._id)}
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
    </>
  );
};

export default UserListItem;
