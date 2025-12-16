import React, { useContext, useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { CiUser } from "react-icons/ci";
import { IoCartSharp } from "react-icons/io5";
import { PiUserCheckLight } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import axios from "axios";

const searchItems = [
  "Aam ka Achar",
  "Nimbu ka Achar",
  "Mixed Vegetable Pickle",
  "Mirchi ka Achar",
];

const menuItems = [
  { title: "Achar", icon: "https://gausamvardhan.sfo3.cdn.digitaloceanspaces.com/image7-mi.jpeg" },
  { title: "Ghee", icon: "https://gausamvardhan.sfo3.cdn.digitaloceanspaces.com/image8-mi.jpeg" },
  { title: "Ganpati", icon: "https://res.cloudinary.com/dkwifvhuw/image/upload/v1765013726/ganpati_x21jyf.png" },
  { title: "PoojaEssentials", icon: "https://gausamvardhan.sfo3.cdn.digitaloceanspaces.com/image9-mi.jpeg" },
];

const Navbar = () => {
  const { totalItems, totalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const drawerRef = useRef(null);
  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const categoryRoutes = {
    Achar: "/achar-category/achar",
    Ghee: "/ghee/ghee",
    Ganpati: "/ganpati-category/ganpati",
    PoojaEssentials: "/agarbatti-category/pooja-essentials",
  };

  const handleMenuRedirect = (item) => {
    setMobileMenu(false);
    const url = categoryRoutes[item.title];
    if (url) navigate(url);
  };

  /** Drawer Animation */
  useEffect(() => {
    if (!drawerRef.current) return;

    gsap.to(drawerRef.current, {
      x: mobileMenu ? 0 : "-100%",
      duration: 0.4,
      ease: "power3.out",
    });
  }, [mobileMenu]);

  /** Mobile Search Animation */
  useEffect(() => {
    if (!dropdownRef.current) return;

    gsap.to(dropdownRef.current, {
      height: showSearch ? "auto" : 0,
      opacity: showSearch ? 1 : 0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  }, [showSearch]);

  /** Placeholder animation */
  useEffect(() => {
    if (!desktopInputRef.current) return;

    const input = desktopInputRef.current;

    const timeline = gsap.timeline({ repeat: -1 });

    searchItems.forEach((text) => {
      // Typewriter forward
      for (let i = 0; i <= text.length; i++) {
        timeline.call(
          () => {
            if (input) input.placeholder = text.slice(0, i);
          },
          null,
          "+=0.06"
        );
      }

      timeline.to({}, { duration: 1 });

      // Typewriter backward
      for (let i = text.length; i >= 0; i--) {
        timeline.call(
          () => {
            if (input) input.placeholder = text.slice(0, i);
          },
          null,
          "+=0.04"
        );
      }

      timeline.to({}, { duration: 0.4 });
    });

    return () => timeline.kill();
  }, []);

  /** SEARCH WORKING */
  useEffect(() => {
  if (!searchQuery) {
    setSearchResults([]);
    return;
  }

  const fetchSearch = async () => {
    setLoading(true);

    try {
      const [
        gheeRes,
        masalaRes,
        oilRes,
        productRes,
        ganpatiRes,
        agarbattiRes
      ] = await Promise.all([
        axios.get(`/api/ghee-products/search/${encodeURIComponent(searchQuery)}`),
        axios.get(`/api/masala-products/search/${encodeURIComponent(searchQuery)}`),
        axios.get(`/api/oils/search/${encodeURIComponent(searchQuery)}`),
        axios.get(`/api/products/search/${encodeURIComponent(searchQuery)}`),
        // ⭐⭐ NEW GANPATI SEARCH ⭐⭐
        axios.get(`/api/ganpati/search/${encodeURIComponent(searchQuery)}`),
        axios.get(`/api/agarbatti/search/${encodeURIComponent(searchQuery)}`)
      ]);

      const allItems = [
        ...gheeRes.data.map((i) => ({ ...i, type: "Ghee" })),
        ...masalaRes.data.map((i) => ({ ...i, type: "Masala" })),
        ...oilRes.data.map((i) => ({ ...i, type: "Oil" })),
        ...productRes.data.map((i) => ({ ...i, type: "Product" })),
        ...agarbattiRes.data.map((i) => ({ ...i, type: "Agarbatti" })),

        // ⭐⭐ ADD GANPATI RESULTS ⭐⭐
        ...ganpatiRes.data.map((i) => ({ ...i, type: "Ganpati" })),
      ];

      setSearchResults(allItems);
    } catch (err) {
      console.error("Search error:", err);
    }

    setLoading(false);
  };

  const delay = setTimeout(fetchSearch, 300);
  return () => clearTimeout(delay);
}, [searchQuery]);

  /** Redirect */
  const handleRedirect = (item) => {
    setSearchQuery("");
    setShowSearch(false);
    setMobileMenu(false);

    if (item.type === "Ghee")
      navigate(`/ghee-product/${item.slug}/${item._id}`);
    if (item.type === "Masala")
      navigate(`/masala-product/${item.slug}/${item._id}`);
    if (item.type === "Oil") navigate(`/oil-product/${item.slug}/${item._id}`);
    if (item.type === "Product")
      navigate(`/products/${item.category?.slug || "default"}/${item._id}`);
    if (item.type === "Ganpati")
  navigate(`/ganpati-product/${item.slug}/${item._id}`);
if (item.type === "Agarbatti")
  navigate(`/agarbatti-product/${item.slug}/${item._id}`);

  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleRedirect(searchResults[0]);
    }
  };

  const renderSearchResults = () =>
    loading ? (
      <div className="p-3 text-gray-500">Loading...</div>
    ) : searchQuery && searchResults.length === 0 ? (
      <div className="p-3 text-gray-500">No products found.</div>
    ) : (
      searchResults.map((item, i) => (
        <div
          key={i}
          onClick={() => handleRedirect(item)}
          className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-none"
        >
          <p className="font-medium">{item.title || item.productName}</p>
          <p className="text-gray-400 text-xs">
            ({item.category?.name || item.type})
          </p>
        </div>
      ))
    );

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md sticky top-0 z-[999] w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Mobile Hamburger */}
            <button
              className="text-2xl text-gray-400 md:hidden"
              onClick={() => setMobileMenu(true)}
            >
              <BiMenuAltLeft />
            </button>

            {/* LOGO */}
            <Link to="/">
              <img
                src="/GauSamvardhan.png"
                alt="Logo"
                className="w-20 md:w-28 lg:w-32 ml-3 md:ml-6 lg:ml-10"
              />
            </Link>

            {/* DESKTOP SEARCH */}
            <div className="hidden md:flex flex-1 justify-center px-4">
              <div className="w-full max-w-xl relative">
                <input
                  ref={desktopInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchEnter}
                  className="w-full border rounded-md border-gray-300 px-5 py-2 text-sm shadow-sm"
                />
                <CiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#008031]" />

                {searchQuery && (
                  <div className="absolute top-full mt-1 w-full bg-white shadow-lg border max-h-72 overflow-y-auto z-50">
                    {renderSearchResults()}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE ICONS */}
            <div className="flex items-center space-x-6">

              {/* Mobile Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="md:hidden text-xl text-gray-400"
              >
                <CiSearch />
              </button>

              {/* SIGN IN */}
              {!user ? (
                <Link to="/signin" className="text-green-400 text-2xl">
                  <CiUser />
                </Link>
              ) : (
                <Link to="/profile" className="text-green-400 text-2xl">
                  <PiUserCheckLight />
                </Link>
              )}

              {/* CART */}
              <Link to="/cart" className="flex items-center gap-3 text-green-400 text-2xl relative">
                <div className="relative">
                  <IoCartSharp />
                  <span className="absolute -top-2 -right-2 bg-[#008031] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <span className="hidden sm:block text-gray-700 text-sm font-semibold">
                  ₹{totalPrice.toFixed(2)}
                </span>
              </Link>
            </div>
          </div>

          {/* MOBILE SEARCH */}
          <div ref={dropdownRef} className="md:hidden overflow-hidden">
            {showSearch && (
              <div className="py-3">
                <input
                  ref={mobileInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2 shadow-sm"
                  placeholder="Search..."
                  onKeyDown={handleSearchEnter}
                />

                {searchQuery && (
                  <div className="bg-white shadow-md mt-1 border max-h-60 overflow-y-auto">
                    {renderSearchResults()}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* BACKDROP */}
      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300"
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 h-full w-[80%] max-w-[330px] bg-[#FAFDF9] 
          shadow-2xl z-[9999] p-7 rounded-r-[32px] overflow-y-auto
          transform transition-transform duration-300 ease-[cubic-bezier(.25,.8,.25,1)]
          ${mobileMenu ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={() => setMobileMenu(false)}
          className="absolute top-5 right-5 text-2xl text-[#3C6E4E] hover:text-[#265F3D] transition"
        >
          <FaTimes />
        </button>

        {/* SECTION WRAPPER */}
        <div className="mt-2">

          {/* SHOP ALL */}
          <div
            onClick={() => navigate("/all-products")}
            className="text-[#144B32] font-semibold text-[17px] tracking-wide py-3 cursor-pointer"
          >
            SHOP ALL
          </div>

          <div className="border-b border-[#DDE7DD] my-1"></div>

          {/* MEMBERSHIP */}
          <div
            onClick={() => navigate("/membership")}
            className="flex items-center gap-2 cursor-pointer py-4"
          >
            <span className="bg-[#144B32] text-white font-semibold text-[11px] px-3 py-1 rounded-md tracking-wider shadow-sm">
              COLLECTIVE
            </span>

            <span className="text-[#85772B] font-semibold text-sm tracking-wide">
              MEMBERSHIP
            </span>
          </div>

          <div className="border-b border-[#DDE7DD] mb-2"></div>

          {/* NEW LINKS */}
          <div className="py-4">
            <Link
              to="/GausamvardhanOrganicHandcrafted"
              onClick={() => setMobileMenu(false)}
              className="text-[#144B32] font-semibold tracking-wide text-[15px]"
            >
              Gausamvardhan Organic & Handcrafted
            </Link>
          </div>

          <div className="border-b border-[#DDE7DD]"></div>

          <div className="py-4">
            <Link
              to="/about"
              onClick={() => setMobileMenu(false)}
              className="text-[#144B32] font-semibold tracking-wide text-[15px]"
            >
              About Us
            </Link>
          </div>

          <div className="border-b border-[#DDE7DD]"></div>

          <div className="py-4">
            <Link
              to="/contact"
              onClick={() => setMobileMenu(false)}
              className="text-[#144B32] font-semibold tracking-wide text-[15px]"
            >
              Contact Us
            </Link>
          </div>

          <div className="border-b border-[#DDE7DD]"></div>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-2 gap-5 mt-7">
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleMenuRedirect(item)}
              className="
                flex flex-col items-center p-4 rounded-xl 
                bg-white border border-[#E9F0E9] 
                hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer
              "
            >
              <img
                src={item.icon}
                className="w-12 h-12 object-contain mb-2"
                alt={item.title}
              />
              <p className="text-sm font-medium text-[#144B32] text-center tracking-wide">
                {item.title}
              </p>
            </div>
          ))}
        </div>

      </div>
    </>
  );
};

export default Navbar;
