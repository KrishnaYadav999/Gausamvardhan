import React, { useEffect, useState, useContext, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { FiFilter, FiX } from "react-icons/fi";
import Filter from "../components/Filter";

const OilCategoryProduct = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState({});
  const [mainImages, setMainImages] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ price: [0, 5000], rating: 0, stock: false });
  const { addToCart } = useContext(CartContext);

  // ✅ Normalize price (remove ₹, symbols etc.)
  const normalizePrice = (price) => {
    if (!price) return 0;
    return parseFloat(String(price).replace(/[^0-9.]/g, ""));
  };

  // ✅ Safe get price
  const getPriceByVolume = (product, volume) => {
    if (!volume) return normalizePrice(product.currentPrice);
    const found = product.perPriceLiter?.find((p) => p.volume === volume);
    return found ? normalizePrice(found.price) : normalizePrice(product.currentPrice);
  };

  // ✅ Safe discount calculation
  const calculateDiscount = (cutPrice, selectedPrice) => {
    const cp = normalizePrice(cutPrice);
    const curr = normalizePrice(selectedPrice);
    if (!cp || !curr) return null;
    return Math.round(((cp - curr) / cp) * 100);
  };

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/oils/category/${slug}`);
        setProducts(data);
        setFilteredProducts(data);

        const volumes = {};
        const images = {};
        data.forEach((product) => {
          volumes[product._id] =
            Array.isArray(product.perPriceLiter) && product.perPriceLiter.length > 0
              ? product.perPriceLiter[0].volume
              : "";
          images[product._id] = product.productImages?.[0] || "https://via.placeholder.com/300";
        });
        setSelectedVolumes(volumes);
        setMainImages(images);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load products");
      }
    };
    fetchProducts();
  }, [slug]);

  // ✅ Add product to cart
  const handleAddToCart = (product) => {
    const volume = selectedVolumes[product._id];
    if (!volume) return toast.error("❌ Please select a volume");
    if (!product.stock) return toast.error("❌ Out of stock");

    const selectedPrice = getPriceByVolume(product, volume);
    addToCart({
      _id: product._id,
      productName: product.productName,
      selectedVolume: volume,
      quantity: 1,
      selectedPrice,
      cutPrice: normalizePrice(product.cutPrice) || 0,
      productImages: product.productImages || [],
    });

    toast.success(`🛒 ${product.productName} (${volume}) added!`);
  };

  // ✅ Filter handler
  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      const temp = products.filter((product) => {
        const volume = selectedVolumes[product._id];
        const price = getPriceByVolume(product, volume);
        const inPriceRange = price >= newFilters.price[0] && price <= newFilters.price[1];
        const inStock = newFilters.stock ? product.stock : true;
        const meetsRating = newFilters.rating ? (product.rating || 0) >= newFilters.rating : true;
        return inPriceRange && inStock && meetsRating;
      });
      setFilteredProducts(temp);
    },
    [products, selectedVolumes]
  );

  if (!products || products.length === 0)
    return <p className="text-center py-10">No products found.</p>;

  return (
    <div className="px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize border-b pb-2 flex-1">
          {slug} Oil Products
        </h2>
        <button
          className="md:hidden flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg shadow hover:bg-yellow-700"
          onClick={() => setFilterOpen(true)}
        >
          <FiFilter /> Filters
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filter */}
        <div className="hidden md:block md:w-72">
          <Filter minPrice={0} maxPrice={5000} onFilterChange={handleFilterChange} />
        </div>

        {/* Mobile Filter Drawer */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black bg-opacity-50" onClick={() => setFilterOpen(false)}></div>
            <div className="w-72 max-w-sm bg-white h-full shadow-lg p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setFilterOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>
              <Filter minPrice={0} maxPrice={5000} onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const isOutOfStock = !product.stock;
            const volumes = Array.isArray(product.perPriceLiter)
              ? product.perPriceLiter.map((p) => p.volume)
              : [];
            const selectedVolume = selectedVolumes[product._id] || volumes[0] || "";
            const selectedPrice = getPriceByVolume(product, selectedVolume);

            return (
              <div
                key={product._id}
                className={`relative bg-white rounded-lg shadow hover:shadow-lg transition flex flex-col ${isOutOfStock ? "opacity-50" : ""}`}
              >
                {product.cutPrice && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {calculateDiscount(product.cutPrice, selectedPrice)}% OFF
                  </span>
                )}

                <Link to={`/oil-product/${product.slug}/${product._id}`} className="overflow-hidden">
                  <img
                    src={mainImages[product._id]}
                    alt={product.productName}
                    className="w-full h-44 object-contain transition-transform duration-300 hover:scale-105"
                  />
                </Link>

                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
                    {product.productName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                    {product.description}
                  </p>

                  {/* Volume Selection */}
                  {volumes.length > 0 && (
                    <div className="flex space-x-2 mt-2 flex-wrap">
                      {volumes.map((vol) => (
                        <button
                          key={vol}
                          onClick={() =>
                            setSelectedVolumes((prev) => ({ ...prev, [product._id]: vol }))
                          }
                          className={`px-2 py-1 border rounded text-xs ${
                            selectedVolumes[product._id] === vol
                              ? "border-yellow-600 text-yellow-600"
                              : "border-gray-300 text-gray-700"
                          }`}
                          disabled={isOutOfStock}
                        >
                          {vol} ₹{getPriceByVolume(product, vol)}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Price & Add to Cart */}
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-yellow-600 font-bold text-sm sm:text-base">{selectedPrice}₹</p>
                      {product.cutPrice && (
                        <p className="text-xs text-gray-400 line-through">{normalizePrice(product.cutPrice)}₹</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm transition ${
                        isOutOfStock || !selectedVolume
                          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                          : "bg-yellow-600 text-white hover:bg-yellow-700"
                      }`}
                      disabled={isOutOfStock || !selectedVolume}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OilCategoryProduct;
