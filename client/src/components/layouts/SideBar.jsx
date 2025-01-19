import React, { useEffect, useState } from "react";
import { getAllComponents } from "../../services/componentService";
import { Link, useParams } from "react-router-dom";

const SideBar = () => {
  const [components, setComponents] = useState([]);
  const { componentId } = useParams(); // Get the componentId from the URL

  useEffect(() => {
    const fetchComponents = async () => {
      try {
        const data = await getAllComponents();
        setComponents(data.components); // Set the components data
      } catch (error) {
        console.error("Failed to load components");
      }
    };

    fetchComponents(); // Fetch components on component mount
  }, []);

  return (
    <div className="sidebar-container lg:h-screen overflow-y-auto bg-zinc-900 p-4">
      <ul>
        {/* "All" link */}
        <Link to="/ui-components">
          <li
            className={`p-2 hover:bg-zinc-700 w-full mb-1 text-white rounded cursor-pointer ${
              !componentId ? "bg-zinc-800" : ""
            }`}
          >
            All
          </li>
        </Link>

        {/* Map over components */}
        {components.length > 0 ? (
          components.map((component) => (
            <Link key={component._id} to={`/ui-components/${component._id}`}>
              <li
                className={`p-2 hover:bg-zinc-700 w-full mb-1 text-white rounded cursor-pointer ${
                  component._id === componentId ? "bg-zinc-800" : ""
                }`}
              >
                {component.name}
              </li>
            </Link>
          ))
        ) : (
          <li className="text-white p-2">No components available</li>
        )}
      </ul>
    </div>
  );
};


export default SideBar;
