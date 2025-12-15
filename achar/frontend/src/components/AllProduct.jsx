import React, { useRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";

const BASE_URL = "http://localhost:5000/api";

/* ---------------- HELPERS ---------------- */

// Ghee weight pricing
const getPriceByWeight = (product, weight) => {
  if (!product?.pricePerGram || !weight) return Number(product.currentPrice) || 0;
  const map = {};
  product.pricePerGram.split(",").forEach((p) => {
    const [w, v] = p.split("=");
    if (w && v) map[w.trim()] = Number(v.trim());
  });
  return map[weight] || Number(product.currentPrice) || 0;
};

// Ganpati pack pricing
const getPriceByGanpatiPack = (packs, selectedPack) => {
  if (!packs?.length || !selectedPack) return 0;
  const found = packs.find((p) => p.name === selectedPack);
  return found ? Number(found.price) : 0;
};

const getDiscountPercent = (cut, current) => {
  if (!cut || !current || cut <= current) return 0;
  return Math.round(((cut - current) / cut) * 100);
};

/* ---------------- MAIN ---------------- */
const HolidayPicks = () => {
  const sliderRef = useRef(null);
  const { addToCart } = useContext(CartContext);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ALL ---------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [ghee, ganpati, agarbatti, achar] = await Promise.all([
          axios.get(`${BASE_URL}/ghee-products`),
          axios.get(`${BASE_URL}/ganpati/all`),
          axios.get(`${BASE_URL}/agarbatti/all`),
          axios.get(`${BASE_URL}/products`),
        ]);

        const gheeData = ghee.data.map((p) => ({
          ...p,
          tag: "Ghee",
          productName: p.productName,
          cutPrice: p.cutPrice,
          currentPrice: p.currentPrice,
          selectedWeight: p.pricePerGram
            ? p.pricePerGram.split(",")[0].split("=")[0].trim()
            : "",
          productImages: p.productImages,
        }));

        const ganpatiData = ganpati.data.map((p) => ({
          ...p,
          tag: "Ganpati",
          productName: p.title,
          cutPrice: p.cut_price,
          currentPrice: p.current_price,
          packs: p.packs || [],
          selectedPack: p.packs?.[0]?.name || "",
          productImages: p.images,
        }));

        const agarbattiData = agarbatti.data.map((p) => ({
          ...p,
          tag: "Agarbatti",
          productName: p.productName || p.title,
          cutPrice: p.cutPrice,
          currentPrice: p.currentPrice,
          productImages: p.productImages,
        }));

        const acharData = achar.data.map((p) => ({
          ...p,
          tag: "Achar",
          productName: p.productName,
          cutPrice: p.cutPrice,
          currentPrice: p.currentPrice,
          productImages: p.productImages,
        }));

        setProducts([
          {
            id: "banner",
            isBanner: true,
            title: "Pure & Authentic Products",
            subtitle: "GAUSAMVARDHAN",
            video:
              "https://res.cloudinary.com/dtvihyts8/video/upload/v1765741394/27b760446327b60270741cf4f4d8ec2f_jgkbkk.mp4",
          },
          ...gheeData,
          ...ganpatiData,
          ...agarbattiData,
          ...acharData,
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  /* ---------------- SLIDE ---------------- */
  const slide = (dir) => {
    sliderRef.current.scrollBy({
      left: dir === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  /* ---------------- ADD TO CART ---------------- */
  const handleAddToCart = (product) => {
    let price = Number(product.currentPrice);

    if (product.pricePerGram) {
      price = getPriceByWeight(product, product.selectedWeight);
      if (!product.selectedWeight) return toast.error("Select weight");
    }

    if (product.packs?.length) {
      price = getPriceByGanpatiPack(product.packs, product.selectedPack);
      if (!product.selectedPack) return toast.error("Select pack");
    }

    addToCart({ ...product, selectedPrice: price });
    toast.success(`${product.productName} added to cart`);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 text-lg">
        Loading products...
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] py-16 px-6 relative overflow-hidden">
      <h2 className="text-4xl font-semibold mb-10">
        <span className="text-blue-600">Best</span>{" "}
        <span className="text-orange-500">Selling</span>{" "}
        <span className="text-gray-900">Product</span>
      </h2>

      {/* SLIDER BUTTONS */}
      <button
        onClick={() => slide("left")}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => slide("right")}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow"
      >
        <ChevronRight />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-6"
      >
        {products.map((item, index) =>
          item.isBanner ? (
            /* -------- BANNER -------- */
            <div
              key={index}
              className="min-w-[380px] h-[460px] rounded-3xl shadow-lg relative overflow-hidden p-8"
            >
              <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <p className="text-xs tracking-widest text-gray-600 mb-3">
                    {item.subtitle}
                  </p>
                  <h3 className="text-3xl font-semibold">{item.title}</h3>
                </div>
                <video
                  src={item.video}
                  autoPlay
                  muted
                  loop
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
            </div>
          ) : (
            /* -------- PRODUCT CARD -------- */
            <div
              key={item._id}
              className="min-w-[300px] bg-white rounded-3xl p-4 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <img
                src={item.productImages?.[0]}
                className="h-48 w-full object-cover rounded-xl mb-3"
                alt=""
              />

              <span className="text-orange-500 text-sm font-medium">
                {item.tag}
              </span>

              <h3 className="font-semibold text-lg">{item.productName}</h3>

              {/* PRICE */}
              <div className="flex items-center gap-2 my-1">
                {item.cutPrice > 0 && (
                  <span className="line-through text-gray-400 text-sm">
                    ₹{item.cutPrice}
                  </span>
                )}
                <span className="text-lg font-semibold">
                  ₹{item.currentPrice}
                </span>
                {item.cutPrice > item.currentPrice && (
                  <span className="text-green-600 text-xs font-semibold">
                    {getDiscountPercent(item.cutPrice, item.currentPrice)}% OFF
                  </span>
                )}
              </div>

              {/* WEIGHT */}
              {item.pricePerGram && (
                <select
                  value={item.selectedWeight}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p._id === item._id
                          ? { ...p, selectedWeight: e.target.value }
                          : p
                      )
                    )
                  }
                  className="border px-3 py-2 my-2 rounded-md"
                >
                  {item.pricePerGram.split(",").map((p) => {
                    const w = p.split("=")[0].trim();
                    return (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    );
                  })}
                </select>
              )}

              {/* GANPATI PACKS */}
              {item.packs?.length > 0 && (
                <select
                  value={item.selectedPack}
                  onChange={(e) =>
                    setProducts((prev) =>
                      prev.map((p) =>
                        p._id === item._id
                          ? { ...p, selectedPack: e.target.value }
                          : p
                      )
                    )
                  }
                  className="border px-3 py-2 my-2 rounded-md"
                >
                  {item.packs.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} – ₹{p.price}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={() => handleAddToCart(item)}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-3"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default HolidayPicks;
