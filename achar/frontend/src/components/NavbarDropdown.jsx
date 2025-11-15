import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const NavbarDropdown = () => {
  const [acharProducts, setAcharProducts] = useState([]);
  const [gheeProducts, setGheeProducts] = useState([]);
  const [masalaProducts, setMasalaProducts] = useState([]);
  const [oilProducts, setOilProducts] = useState([]); // ✅ Oil state

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch all product categories simultaneously
        const [acharRes, gheeRes, masalaRes, oilRes] = await Promise.all([
          axios.get("/api/products/category/achar"),
          axios.get("/api/ghee-products"),
          axios.get("/api/masala-products"),
          axios.get("/api/oils/category/oil"), // ✅ Oil API
        ]);

        setAcharProducts(acharRes.data);
        setGheeProducts(gheeRes.data);
        setMasalaProducts(masalaRes.data);
        setOilProducts(oilRes.data); // ✅ set Oil products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const getProductImage = (product) => {
    return (
      product.image ||
      product.images?.[0] ||
      product.productImages?.[0] ||
      product.thumbnail ||
      product.productImage ||
      "https://via.placeholder.com/150"
    );
  };

  const renderDropdown = (title, products, linkPrefix) => (
    <div className="group relative">
      <button className="font-semibold text-[15px] tracking-wide hover:text-[#008031] transition-colors">
        {title}
      </button>

      <div
        className="absolute left-0 top-full hidden group-hover:flex gap-10 
          bg-white shadow-xl rounded-lg min-w-[700px] z-50 p-6
          opacity-0 scale-95 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
          transition-all duration-300 ease-out"
      >
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-3 border-b pb-2 text-[16px]">
            {title} Products
          </h3>
          <ul className="grid grid-cols-1 gap-2">
            {products.map((product) => (
              <li key={product._id}>
                <Link
                  to={`/${linkPrefix}/${product.slug || product.category?.slug}/${product._id}`}
                  className="block px-2 py-1 rounded-md text-gray-700 text-sm hover:text-[#008031] hover:bg-gray-50 transition-colors"
                >
                  {product.productName || product.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-4">
          {products.slice(0, 4).map((product) => {
            const img = getProductImage(product);
            return (
              <div key={product._id} className="text-center">
                <Link
                  to={`/${linkPrefix}/${product.slug || product.category?.slug}/${product._id}`}
                >
                  <img
                    src={img}
                    alt={product.productName || product.title}
                    className="w-full h-32 object-cover rounded-md shadow-sm hover:scale-105 transition-transform"
                  />
                  <p className="mt-2 text-xs font-medium text-gray-600 hover:text-[#008031]">
                    {product.productName || product.title}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <nav className="shadow-md px-6 py-3 flex gap-10 text-black text-[15px]">
      {renderDropdown("Achar", acharProducts, "products")}
      {renderDropdown("Ghee", gheeProducts, "ghee-product")}
      {renderDropdown("Masala", masalaProducts, "masala-product")}
      {renderDropdown("Oil", oilProducts, "oil-product")} {/* ✅ Oil dropdown */}
    </nav>
  );
};

export default NavbarDropdown;
