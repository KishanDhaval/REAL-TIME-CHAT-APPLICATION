import React from "react";

const SearchLoader = () => {
  return (
    <div
      role="status"
      className="space-y-4 animate-pulse max-w-md mx-auto p-4"
    >
      {/* Single loader item */}
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 border-b border-gray-200 pb-4 dark:border-gray-700"
        >
          {/* Circle loader for avatar */}
          <div className="w-10 h-10 bg-gray-300 rounded-full dark:bg-gray-600"></div>
          {/* Text loader */}
          <div className="flex-1">
            <div className="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-1/2"></div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SearchLoader;
