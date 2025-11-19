import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const NavbarDropdown = () => {
  const [acharProducts, setAcharProducts] = useState([]);
  const [gheeProducts, setGheeProducts] = useState([]);
  const [masalaProducts, setMasalaProducts] = useState([]);
  const [oilProducts, setOilProducts] = useState([]);

  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [acharRes, gheeRes, masalaRes, oilRes] = await Promise.all([
          axios.get("/api/products/category/achar"),
          axios.get("/api/ghee-products"),
          axios.get("/api/masala-products"),
          axios.get("/api/oils/category/oil"),
        ]);

        setAcharProducts(acharRes.data);
        setGheeProducts(gheeRes.data);
        setMasalaProducts(masalaRes.data);
        setOilProducts(oilRes.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const getImg = (p) =>
    p.image ||
    p.images?.[0] ||
    p.productImages?.[0] ||
    p.thumbnail ||
    p.productImage ||
    "https://via.placeholder.com/150";

  // ============================
  // DESKTOP DROPDOWN (Smooth UI)
  // ============================
  const DesktopDropdown = (title, products, prefix) => (
    <div className="group relative hidden md:block">
      <button
        className="
          text-[15px] font-normal
          text-[#1A6F53] tracking-wide 
          hover:text-[#228C67]
          transition-all
        "
      >
        {title}
      </button>

      <div
        className="
          absolute right-0 top-full 
          hidden group-hover:flex 
          gap-10 bg-white shadow-xl rounded-2xl min-w-[720px] 
          z-50 p-6
          opacity-0 scale-95 translate-y-3
          group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
          transition-all duration-300 ease-out
        "
      >
        <div className="flex-1">
          <h3
            className="
              text-lg font-medium text-[#1A6F53] mb-3 
              border-b pb-2 border-gray-200
            "
          >
            {title} Collection
          </h3>

          <ul className="grid grid-cols-1 gap-1">
            {products.map((p) => (
              <li key={p._id}>
                <Link
                  to={`/${prefix}/${p.slug || p.category?.slug}/${p._id}`}
                  className="
                    block px-3 py-1 rounded-md 
                    text-sm font-normal tracking-wide
                    text-gray-700 
                    hover:bg-[#E5F6EA] hover:text-[#1A6F53]
                    transition
                  "
                >
                  {p.productName || p.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((p) => (
            <div key={p._id} className="text-center">
              <Link to={`/${prefix}/${p.slug || p.category?.slug}/${p._id}`}>
                <img
                  src={getImg(p)}
                  alt=""
                  className="
                    w-full h-32 object-cover rounded-xl shadow 
                    hover:scale-[1.04] transition
                  "
                />
                <p
                  className="
                    mt-2 text-sm font-normal tracking-wide 
                    text-gray-700 hover:text-[#228C67]
                  "
                >
                  {p.productName || p.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ============================
  // MOBILE MENU
  // ============================
  const MobileDropdown = (title, products, prefix, id) => (
    <div className="md:hidden relative flex">
      <button
        onClick={() => setOpenMenu(openMenu === id ? null : id)}
        className="
          font-medium tracking-wide 
          px-2 py-1 text-[#1A6F53]
        "
      >
        {title}
      </button>

      {openMenu === id && (
        <div
          className="
            absolute right-0 top-[110%]
            bg-white w-48 shadow-lg rounded-xl 
            p-2 z-50 border border-[#C8ECCC]
          "
        >
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/${prefix}/${p.slug || p.category?.slug}/${p._id}`}
              className="
                block text-sm font-normal tracking-wide 
                px-2 py-1 rounded text-gray-700 
                hover:bg-[#E5F6EA] hover:text-[#1A6F53]
              "
            >
              {p.productName || p.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav
        className="
          hidden md:flex shadow-md px-8 py-4 gap-10 
          text-[15px] justify-end bg-white
        "
      >
        {DesktopDropdown("Achar", acharProducts, "products")}
        {DesktopDropdown("Ghee", gheeProducts, "ghee-product")}
        {DesktopDropdown("Masala", masalaProducts, "masala-product")}
        {DesktopDropdown("Oil", oilProducts, "oil-product")}
      </nav>

      {/* MOBILE NAVBAR */}
      <nav
        className="
          md:hidden flex justify-end gap-4 py-3 shadow-md 
          text-[15px] font-medium tracking-wide
          bg-[#E5F6EA]
        "
      >
        {MobileDropdown("Achar", acharProducts, "products", "achar")}
        {MobileDropdown("Ghee", gheeProducts, "ghee-product", "ghee")}
        {MobileDropdown("Masala", masalaProducts, "masala-product", "masala")}
        {MobileDropdown("Oil", oilProducts, "oil-product", "oil")}
      </nav>
    </>
  );
};

export default NavbarDropdown;
