import React, { useState } from "react";
import { GiCampfire } from "react-icons/gi";

const SidebarWorker = ({ setActive }) => {
  const [active, setActiveItem] = useState("");

  const menuItems = [
    { label: "Dashboard", key: "dashboard" },
    { label: "Stock Quantity", key: "stockquantity" },
    { label: "All User", key: "alluser" },
    { label: "User Orders", key: "userorders" },

    { label: "Banner", key: "banner" },
    { label: "Small Banner", key: "smallbanner" },

    { label: "Achar Category", key: "acharcategory" },
    { label: "Achar Product", key: "acharproduct" },
    { label: "Achar Product Delete/Update", key: "acharproductdeleteupdate" },

    { label: "Ghee Product Create", key: "gheeproductcreate" },
    { label: "Ghee Update/Delete", key: "gheeproductupdatedelete" },

    { label: "Masala Product Create", key: "masalaproductcreate" },
    { label: "Masala Update/Delete", key: "masalaproductupdatedelete" },

    { label: "Oil Product Create", key: "oilproductcreate" },
    { label: "Oil Update/Delete", key: "oilproductupdatedelete" },

    { label: "Agarbatti Create", key: "adminagarbaticreate" },
    { label: "Agarbatti Update/Delete", key: "adminagarbattiupdatedelete" },

    { label: "Ganpati Create", key: "adminganpaticreate" },
    { label: "Ganpati Manage", key: "adminganpatimanage" },

    { label: "Cup Product Create", key: "cupcreate" },

    { label: "Video Advertise Create", key: "admincreateadvertize" },
    { label: "Video Advertise Update/Delete", key: "videoadvertizeupdatedelete" },
  ];

  const handleClick = (key) => {
    setActive(key);
    setActiveItem(key);
  };

  return (
    <div
      className="
        w-64 h-screen bg-[#f9fafb] border-r border-gray-200 
        p-5 flex flex-col select-none
      "
    >
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <GiCampfire className="text-rose-500 text-2xl" />
        Worker Panel
      </h2>

      {/* Menu */}
      <ul className="space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive = active === item.key;

          return (
            <li
              key={item.key}
              onClick={() => handleClick(item.key)}
              className={`
                relative flex items-center px-4 py-2.5 rounded-lg cursor-pointer
                transition-all duration-200 text-[14px]

                ${
                  isActive
                    ? "bg-white shadow-sm border border-gray-300 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                }
              `}
            >
              {/* Left active indicator */}
              {isActive && (
                <span className="absolute left-0 top-0 h-full w-[4px] bg-rose-500 rounded-r-md"></span>
              )}

              {item.label}
            </li>
          );
        })}
      </ul>

      {/* Bottom Logo */}
      <div className="mt-auto pt-5 flex items-center justify-center gap-2 text-gray-400">
        <GiCampfire className="text-xl" />
        <p className="text-xs tracking-wide">Powered by Admin</p>
      </div>
    </div>
  );
};

export default SidebarWorker;
