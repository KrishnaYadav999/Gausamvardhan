import React, { useContext, useState, useRef, useEffect } from "react";
import { FaSearch, FaShoppingBag, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

// 🔹 Animated placeholder values
const searchItems = [
  "Aam ka Achar",
  "Nimbu ka Achar",
  "Mixed Vegetable Pickle",
  "Mirchi ka Achar",
];

const Navbar = () => {
  const { totalItems, totalPrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const desktopInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // MOBILE SEARCH DROPDOWN ANIMATION
  useEffect(() => {
    if (!dropdownRef.current) return;

    gsap.to(dropdownRef.current, {
      height: showSearch ? "auto" : 0,
      opacity: showSearch ? 1 : 0,
      duration: 0.35,
      ease: "power2.inOut",
    });
  }, [showSearch]);

  // PLACEHOLDER TYPING ANIMATION
  useEffect(() => {
    if (!desktopInputRef.current) return;

    const timeline = gsap.timeline({ repeat: -1 });

    searchItems.forEach((text) => {
      // Typing
      for (let i = 0; i <= text.length; i++) {
        timeline.call(() => {
          desktopInputRef.current.placeholder = text.slice(0, i);
        }, null, "+=0.06");
      }

      timeline.to({}, { duration: 1 });

      // Deleting
      for (let i = text.length; i >= 0; i--) {
        timeline.call(() => {
          desktopInputRef.current.placeholder = text.slice(0, i);
        }, null, "+=0.04");
      }

      timeline.to({}, { duration: 0.4 });
    });
  }, []);

  // API SEARCH LOGIC
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const fetchSearch = async () => {
      setLoading(true);

      try {
        const [gheeRes, masalaRes, oilRes, productRes] = await Promise.all([
          axios.get(`/api/ghee-products/search/${encodeURIComponent(searchQuery)}`),
          axios.get(`/api/masala-products/search/${encodeURIComponent(searchQuery)}`),
          axios.get(`/api/oils/search/${encodeURIComponent(searchQuery)}`),
          axios.get(`/api/products/search/${encodeURIComponent(searchQuery)}`),
        ]);

        const allItems = [
          ...gheeRes.data.map((i) => ({ ...i, type: "Ghee" })),
          ...masalaRes.data.map((i) => ({ ...i, type: "Masala" })),
          ...oilRes.data.map((i) => ({ ...i, type: "Oil" })),
          ...productRes.data.map((i) => ({ ...i, type: "Product" })),
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

  // Redirect on click
  const handleRedirect = (item) => {
    setSearchQuery("");

    if (item.type === "Ghee") navigate(`/ghee-product/${item.slug}/${item._id}`);
    if (item.type === "Masala") navigate(`/masala-product/${item.slug}/${item._id}`);
    if (item.type === "Oil") navigate(`/oil-product/${item.slug}/${item._id}`);
    if (item.type === "Product") {
      navigate(`/products/${item.category?.slug || "default"}/${item._id}`);
    }

    setShowSearch(false);
  };

  // Enter key selects first result
  const handleSearchEnter = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleRedirect(searchResults[0]);
    }
  };

  // Search results UI
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
          <p className="font-medium">
            {item.title || item.productName}
          </p>
          <p className="text-gray-400 text-xs">
            ({item.category?.name || item.type})
          </p>
        </div>
      ))
    );

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* NAVBAR CONTAINER */}
        <div className="flex items-center justify-between h-24">
        
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src="/GauSamvardhan.png"
              alt="Logo"
              className="w-20 md:w-28 lg:w-32 object-contain"
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
                className="w-full border border-gray-300 rounded-full px-5 py-2 text-sm shadow-sm focus:outline-none"
              />

              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-[#008031] text-lg" />

              {searchQuery && (
                <div className="absolute top-full mt-1 w-full bg-white shadow-lg rounded-md border max-h-72 overflow-y-auto z-50">
                  {renderSearchResults()}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — LOGIN + CART */}
          <div className="flex items-center space-x-6">

            {/* Mobile Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden text-gray-800 text-xl"
            >
              <FaSearch />
            </button>

            {/* LOGIN */}
            {!user ? (
              <Link
                to="/signin"
                className="text-[#008031] text-3xl hover:scale-110 transition"
              >
                <FaUserCircle />
              </Link>
            ) : (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 text-gray-800 font-semibold hover:text-[#008031] transition"
              >
                <FaUserCircle className="text-3xl text-[#008031]" />
                <span className="hidden md:block">{user.name}</span>
              </button>
            )}

            {/* CART */}
            <Link
              to="/cart"
              className="flex items-center gap-3 text-[#008031] text-2xl relative hover:scale-105 transition"
            >
              <div className="relative">
                <FaShoppingBag />
                <span className="absolute -top-2 -right-2 bg-[#008031] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <span className="hidden sm:block text-gray-800 text-sm font-semibold">
                ₹{totalPrice.toFixed(2)}
              </span>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH DROPDOWN */}
        <div ref={dropdownRef} className="md:hidden overflow-hidden">
          {showSearch && (
            <div className="py-3">
              <input
                ref={mobileInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchEnter}
                placeholder="Search..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 shadow-sm"
              />

              {searchQuery && (
                <div className="bg-white shadow-md rounded-md mt-1 border max-h-60 overflow-y-auto">
                  {renderSearchResults()}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
