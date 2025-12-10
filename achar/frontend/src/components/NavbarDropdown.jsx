import React from "react";
import { Link } from "react-router-dom";

const NavbarDropdown = () => {
  return (
    <>
      {/* ================================ */}
      {/* DESKTOP NAV TOP BAR */}
      {/* ================================ */}

      <nav className="hidden md:flex justify-center gap-12 py-4 shadow-sm bg-white">
        {/* Achar */}
        <Link
          to="/achar-category/achar"
          className="flex items-center gap-2 group"
        >
          <span className="text-[12px] tracking-wide group-hover:text-[#1A6F53]">
            Achar
          </span>
        </Link>

        {/* Ghee */}
        <Link to="/ghee/ghee" className="flex items-center gap-2 group">
          <span className="text-[12px] tracking-wide group-hover:text-[#1A6F53]">
            Ghee
          </span>
        </Link>

        {/* Ganpati */}
        <Link
          to="/ganpati-category/ganpati"
          className="flex items-center gap-2 group"
        >
          <span className="text-[12px] tracking-wide group-hover:text-[#1A6F53]">
            Ganpati
          </span>
        </Link>

        {/* Pooja Essentials */}
        <Link
          to="/agarbatti-category/pooja-essentials"
          className="flex items-center gap-2 group"
        >
          <span className="text-[12px] tracking-wide group-hover:text-[#1A6F53]">
            Pooja Essentials
          </span>
        </Link>

        {/* JOIN COLLECTIVE */}
        <div className="flex items-center gap-2 cursor-pointer select-none">
          <Link to="/JoinCollective" className="flex items-center gap-2">
            {/* JOIN */}
            <span
              className="text-yellow-600 font-extrabold text-[14px] tracking-widest uppercase 
      transition-transform duration-300 hover:scale-110"
            >
              JOIN
            </span>

            {/* COLLECTIVE */}
            <span
              className="relative bg-green-700 text-white font-bold text-[13px] px-4 py-1.5 rounded-lg shadow-lg
      before:absolute before:inset-0 before:rounded-lg before:bg-gradient-to-r before:from-green-600 before:to-green-800 before:opacity-70
      hover:scale-105 hover:shadow-2xl transition-all duration-300 ease-out flex items-center justify-center"
            >
              <span className="relative tracking-wide uppercase">
                COLLECTIVE
              </span>
            </span>
          </Link>
        </div>

        {/* Tagline / Brand */}

        <div className="flex items-center gap-2 group cursor-pointer">
          <Link to="/GausamvardhanOrganicHandcrafted">
            <span className="text-[12px] tracking-wide group-hover:text-[#1A6F53]">
              Gausamvardhan Organic & Handcrafted
            </span>
          </Link>
        </div>

        {/* Connect */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <Link to="/about">
            <span className="text-[12px] tracking-wide group-hover:text-[#1A6F53]">
              About us
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default NavbarDropdown;
