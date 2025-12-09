import React, { useState } from "react";
import {
  Menu,
  UserPlus,
  MapPin,
  Boxes,
  Users,
  LayoutDashboard,
  BadgePercent,
  Image,
  Video,
  ShoppingBag,
  Settings,
} from "lucide-react";

const Sidebar = ({ setActive }) => {
  const [open, setOpen] = useState(true);

  // Track active menu
  const [activeItem, setActiveItem] = useState("");

  // Menu item + icons mapping
  const menuItems = [
    { label: "DASHBOARD", icon: <LayoutDashboard size={18} /> },
    { label: "WORKER CREATE", icon: <UserPlus size={18} /> },
    { label: "WORKER TRACKING", icon: <MapPin size={18} /> },
    { label: "STOCK QUANTITY", icon: <Boxes size={18} /> },
    { label: "ALL USER", icon: <Users size={18} /> },
    { label: "USER ORDERS", icon: <ShoppingBag size={18} /> },
    { label: "BANNER", icon: <Image size={18} /> },
    { label: "SMALL BANNER", icon: <Image size={18} /> },
    { label: "ACHAR CATEGORY", icon: <BadgePercent size={18} /> },
    { label: "ACHAR PRODUCT", icon: <BadgePercent size={18} /> },
    { label: "ACHAR PRODUCT DELETE UPDATE", icon: <Settings size={18} /> },
    { label: "GHEE PRODUCT CREATE", icon: <BadgePercent size={18} /> },
    { label: "GHEE PRODUCT UPDATE DELETE", icon: <Settings size={18} /> },
    { label: "MASALA PRODUCT CREATE", icon: <BadgePercent size={18} /> },
    { label: "MASALA PRODUCT UPDATE DELETE", icon: <Settings size={18} /> },
    { label: "OIL PRODUCT CREATE", icon: <BadgePercent size={18} /> },
    { label: "OIL PRODUCT UPDATE DELETE", icon: <Settings size={18} /> },
    { label: "ADMINAGARBATICREATE", icon: <BadgePercent size={18} /> },
    { label: "ADMINAGARBATTIUPDATEDELETE", icon: <Settings size={18} /> },
    { label: "ADMINCREATEADVERTIZE", icon: <Video size={18} /> },
    { label: "VIDEOADVERTIZEUPDATEDELETE", icon: <Video size={18} /> },
    { label: "adminganpaticreate", icon: <Settings size={18} /> },
    { label: "adminganpatimanage", icon: <Settings size={18} /> },
    { label: "cupcreate", icon: <BadgePercent size={18} /> },
    { label: "USERS", icon: <Users size={18} /> },
  ];

  const handleClick = (label) => {
    const key = label.toLowerCase().replace(/\s+/g, "");
    setActive(key);
    setActiveItem(key);
  };

  return (
    <div
      className={`
        fixed top-0 left-0 h-screen bg-white border-r shadow-lg
        transition-all duration-300 z-[1000]
        ${open ? "w-64" : "w-20"}
        overflow-y-auto
      `}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-3 right-3 text-gray-600 hover:text-black"
      >
        <Menu size={22} />
      </button>

      <div className="px-3 py-5 h-full">
        {open && (
          <h2 className="text-xl font-semibold text-center mb-6 tracking-wide">
            Admin
          </h2>
        )}

        <ul className="space-y-1 pb-10">
          {menuItems.map((item) => {
            const key = item.label.toLowerCase().replace(/\s+/g, "");
            const isActive = activeItem === key;

            return (
              <li
                key={item.label}
                onClick={() => handleClick(item.label)}
                className={`relative flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer
                  font-medium text-sm transition group
                  
                  ${isActive ? "bg-green-500 text-white shadow-md" : "hover:bg-gray-200"}
                `}
              >
                {/* Active left border */}
                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-green-800 rounded-r-md"></span>
                )}

                {/* Icon */}
                <span className="min-w-[20px]">{item.icon}</span>

                {/* Label */}
                {open && <span>{item.label}</span>}

                {/* Tooltip when closed */}
                {!open && (
                  <span
                    className="absolute left-20 bg-black text-white text-xs rounded-md px-2 py-1
                    opacity-0 group-hover:opacity-100 transition-all ml-2 whitespace-nowrap"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
