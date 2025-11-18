import React, { useContext, useState, useRef, useEffect } from "react";
import { FaSearch, FaShoppingBag, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

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

  // Mobile dropdown animation
  useEffect(() => {
    if (dropdownRef.current) {
      gsap.to(dropdownRef.current, {
        height: showSearch ? "auto" : 0,
        opacity: showSearch ? 1 : 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
    }
  }, [showSearch]);

  // Desktop placeholder animation
  useEffect(() => {
    if (!desktopInputRef.current) return;
    const timeline = gsap.timeline({
      repeat: -1,
      defaults: { ease: "power1.inOut" },
    });

    searchItems.forEach((text) => {
      for (let i = 0; i <= text.length; i++) {
        timeline.call(
          () => {
            if (desktopInputRef.current)
              desktopInputRef.current.placeholder = text.substring(0, i);
          },
          null,
          "+=0.08"
        );
      }
      timeline.to({}, { duration: 1.5 });
      for (let i = text.length; i >= 0; i--) {
        timeline.call(
          () => {
            if (desktopInputRef.current)
              desktopInputRef.current.placeholder = text.substring(0, i);
          },
          null,
          "+=0.05"
        );
      }
      timeline.to({}, { duration: 0.3 });
    });
  }, []);

  // Search API
  useEffect(() => {
    if (!searchQuery) {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);

      try {
        const [gheeRes, masalaRes, oilRes, productRes] = await Promise.all([
          axios.get(
            `/api/ghee-products/search/${encodeURIComponent(searchQuery)}`
          ),
          axios.get(
            `/api/masala-products/search/${encodeURIComponent(searchQuery)}`
          ),
          axios.get(`/api/oils/search/${encodeURIComponent(searchQuery)}`),
          axios.get(`/api/products/search/${encodeURIComponent(searchQuery)}`),
        ]);

        const combined = [
          ...gheeRes.data.map((item) => ({ ...item, type: "Ghee" })),
          ...masalaRes.data.map((item) => ({ ...item, type: "Masala" })),
          ...oilRes.data.map((item) => ({ ...item, type: "Oil" })),
          ...productRes.data.map((item) => ({ ...item, type: "Product" })),
        ];

        setSearchResults(combined);
      } catch (err) {
        console.error("Search error:", err);
        setSearchResults([]);
      }

      setLoading(false);
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Handle redirect
  const handleRedirect = (item) => {
    setSearchQuery("");

    if (item.type === "Ghee")
      navigate(`/ghee-product/${item.slug}/${item._id}`);
    else if (item.type === "Masala")
      navigate(`/masala-product/${item.slug}/${item._id}`);
    else if (item.type === "Oil")
      navigate(`/oil-product/${item.slug}/${item._id}`);
    else if (item.type === "Product")
      navigate(`/products/${item.category?.slug || "default"}/${item._id}`);

    setShowSearch(false);
  };

  // Enter key
  const handleSearchEnter = (e) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleRedirect(searchResults[0]);
    }
  };

  // Render search results
  const renderSearchResults = () => {
    if (loading) return <div className="p-2 text-gray-500">Loading...</div>;

    if (!loading && searchQuery && searchResults.length === 0)
      return <div className="p-2 text-gray-500">No products found.</div>;

    return searchResults.map((item, index) => (
      <div
        key={item._id || `${item.productName}-${index}`}
        className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => handleRedirect(item)}
      >
        {item.title || item.productName}
        <span className="text-gray-400 text-sm ml-2">
          ({item.category?.name || item.type})
        </span>
      </div>
    ));
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* MAIN NAV ROW */}
        <div className="flex items-center justify-between h-24 w-full">
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src="/GauSamvardhan.png"
              alt="Logo"
              className="w-20 md:w-28 lg:w-24 object-contain"
            />
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 justify-center px-6">
            <div className="w-full max-w-xl relative flex rounded-full shadow-sm border border-gray-300 bg-white">
              <input
                ref={desktopInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchEnter}
                className="block w-full pl-3 pr-10 py-2 text-sm focus:outline-none rounded-full"
              />
              <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#008031] cursor-pointer" />

              {searchQuery && (
                <div className="absolute z-50 top-full left-0 w-full bg-white shadow-lg rounded-md mt-1 max-h-80 overflow-y-auto border border-gray-200">
                  {renderSearchResults()}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE ICONS */}
          <div className="flex items-center space-x-6">
            {/* Mobile search icon */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="block md:hidden text-gray-700 text-xl"
            >
              <FaSearch />
            </button>

            {/* LOGIN ICON (simple, minimal) */}
            {!user ? (
              <Link
                to="/signin"
                className="flex items-center text-[#008031] text-2xl hover:scale-110 transition-all duration-200"
              >
                <FaUserCircle />
              </Link>
            ) : (
              <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-2 font-semibold text-gray-800 hover:text-[#008031] transition-all"
              >
                <FaUserCircle className="text-3xl text-[#008031]" />
                <span className="hidden md:block">{user.name}</span>
              </button>
            )}

            {/* CART ICON + PRICE */}
            <Link
              to="/cart"
              className="flex items-center gap-2 text-[#008031] text-xl hover:scale-105 transition-all duration-200 relative"
            >
              <div className="relative">
                <FaShoppingBag className="text-2xl" />

                {/* cart count */}
                <span className="absolute -top-2 -right-2 bg-[#008031] text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              </div>

              {/* PRICE ALWAYS VISIBLE */}
              <span className="hidden sm:block text-[15px] text-gray-800 font-semibold">
                ₹{totalPrice.toFixed(2)}
              </span>
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH DROPDOWN */}
        {showSearch && (
          <div ref={dropdownRef} className="md:hidden mt-2 w-full">
            <input
              ref={mobileInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchEnter}
              className="w-full border border-gray-300 rounded-full px-4 py-2"
              placeholder="Search..."
            />

            {searchQuery && (
              <div className="bg-white shadow-lg rounded-md mt-1 max-h-60 overflow-y-auto border border-gray-200">
                {renderSearchResults()}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
