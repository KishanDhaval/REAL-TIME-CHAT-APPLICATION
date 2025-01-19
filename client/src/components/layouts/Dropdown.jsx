import React from "react";
import { Link } from "react-router-dom";

const Dropdown = ({ title, components, userRole, isCreate, color, to }) => {
  return (
    <div className="relative group hover:text-teal-400">
      {" "}
      {/* Group to handle hover state */}
      <Link
        to={to}
        className={`text-${color}  font-normal px-4 py-4 h-full text-xl duration-200 ease hover:text-teal-400 cursor-pointer`}
      >
        {title}
      </Link>
      <div
        className={`absolute left-0 top-full mt-4 min-w-80 bg-zinc-800 text-white rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto`}
      >
        <ul
          className={`py-2 ${
            components.length > 2 ? "grid grid-cols-2 gap-2" : ""
          }`}
        >
          {userRole === 1 ? (
            <>
              <Link to={`/insert/challenge`} key="challenge">
                <li className="px-4 py-2 hover:bg-zinc-700">Challenge</li>
              </Link>
              <Link to={`/insert/component`} key="component">
                <li className="px-4 py-2 hover:bg-zinc-700">Component</li>
              </Link>
            </>
          ) : (
            components.map((component) => (
              <Link
                to={isCreate ? `/component/${component._id}` : `/ui-components/${component._id}`}
                key={component._id} 
              >
                <li className="px-4 py-2 hover:bg-zinc-700">
                  {component.name}
                </li>
              </Link>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dropdown;
