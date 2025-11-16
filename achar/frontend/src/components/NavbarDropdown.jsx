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

  // DESKTOP DROPDOWN (RIGHT SIDE)
  const DesktopDropdown = (title, products, prefix) => (
    <div className="group relative hidden md:block">
      <button className="font-semibold text-[15px] text-[#328E6E] hover:text-[#67AE6E] transition">
        {title}
      </button>

      <div
        className="
          absolute right-0 top-full 
          hidden group-hover:flex 
          gap-10 bg-white shadow-xl rounded-lg min-w-[700px] 
          z-50 p-6
          opacity-0 scale-95 translate-y-2 
          group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
          transition-all duration-300
        "
      >
        <div className="flex-1">
          <h3 className="font-bold mb-3 border-b pb-2 text-[#328E6E]">
            {title} Products
          </h3>
          <ul className="grid grid-cols-1 gap-2">
            {products.map((p) => (
              <li key={p._id}>
                <Link
                  to={`/${prefix}/${p.slug || p.category?.slug}/${p._id}`}
                  className="block px-2 py-1 rounded-md text-sm text-[#328E6E] hover:text-[#67AE6E] hover:bg-[#E1EEBC]"
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
                  className="w-full h-32 object-cover rounded-md shadow-md hover:scale-105 transition-transform"
                />
                <p className="mt-2 text-xs font-medium text-[#328E6E] hover:text-[#67AE6E]">
                  {p.productName || p.title}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // MOBILE DROPDOWN
  const MobileDropdown = (title, products, prefix, id) => (
    <div className="md:hidden relative flex">
      <button
        onClick={() => setOpenMenu(openMenu === id ? null : id)}
        className="font-semibold px-2 py-1 text-[#328E6E]"
      >
        {title}
      </button>

      {openMenu === id && (
        <div
          className="
            absolute right-0 top-[110%]
            bg-white w-48 shadow-lg rounded-md p-2 z-50 border border-[#90C67C]
          "
        >
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/${prefix}/${p.slug || p.category?.slug}/${p._id}`}
              className="block text-sm px-2 py-1 rounded text-[#328E6E] hover:bg-[#E1EEBC]"
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
      <nav className="hidden md:flex shadow-md px-6 py-3 gap-10 text-[15px] justify-end">
        {DesktopDropdown("Achar", acharProducts, "products")}
        {DesktopDropdown("Ghee", gheeProducts, "ghee-product")}
        {DesktopDropdown("Masala", masalaProducts, "masala-product")}
        {DesktopDropdown("Oil", oilProducts, "oil-product")}
      </nav>

      {/* MOBILE NAVBAR */}
      <nav className="md:hidden flex justify-end gap-4 py-3 shadow-md text-[15px] font-semibold bg-[#E1EEBC]">
        {MobileDropdown("Achar", acharProducts, "products", "achar")}
        {MobileDropdown("Ghee", gheeProducts, "ghee-product", "ghee")}
        {MobileDropdown("Masala", masalaProducts, "masala-product", "masala")}
        {MobileDropdown("Oil", oilProducts, "oil-product", "oil")}
      </nav>
    </>
  );
};

export default NavbarDropdown;
