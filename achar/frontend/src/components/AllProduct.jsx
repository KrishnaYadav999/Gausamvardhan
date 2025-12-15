import React, { useRef, useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { CartContext } from "../context/CartContext";
import toast from "react-hot-toast";
import StarRating from "../components/StarRating";
import { Helmet } from "react-helmet-async";

const BASE_URL = "/api";

/* ---------------- HELPERS ---------------- */
const getAvgRating = (reviews = []) => {
  if (!reviews.length) return 0;
  const total = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
  return Number((total / reviews.length).toFixed(1));
};
// Ghee weight pricing
const getPriceByWeight = (product, weight) => {
  if (!product?.pricePerGram || !weight)
    return Number(product.currentPrice) || 0;

  const map = {};
  product.pricePerGram.split(",").forEach((p) => {
    const [w, v] = p.split("=");
    if (w && v) map[w.trim()] = Number(v.trim()); // ensure Number
  });

  return map[weight] !== undefined
    ? map[weight]
    : Number(product.currentPrice) || 0;
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

  const autoSlideRef = useRef(null);
  const isHoveringRef = useRef(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  /* ---------------- PRODUCT CLICK → DETAILS ---------------- */
  const handleProductClick = (product) => {
    if (product.tag === "Ghee") {
      navigate(`/ghee-product/${product.slug}/${product._id}`);
    } else if (product.tag === "Ganpati") {
      navigate(`/ganpati-product/${product.slug}/${product._id}`);
    } else {
      navigate(`/products/${product.category?.slug}/${product._id}`);
    }
  };

const festiveItems = [
  "🌶️", // Mirchi
  "🫚", // Adrak
  "🫙", // Achar Jar
  "🧈", // Ghee
  "🥛", // Dairy products
  "🌿", // Natural / organic touch
  "🍋",
];


  // mouse hover sliding

  const handleMouseEnter = () => {
    isHoveringRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
  };

  // smoot sliding

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || products.length === 0) return;

    // clear old interval (safety)
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }

    autoSlideRef.current = setInterval(() => {
      if (isHoveringRef.current) return;

      const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

      // ⚠️ agar scroll possible hi nahi hai
      if (maxScrollLeft <= 0) return;

      if (slider.scrollLeft >= maxScrollLeft - 5) {
        slider.scrollTo({
          left: 0,
          behavior: "smooth",
        });
      } else {
        slider.scrollBy({
          left: 320,
          behavior: "smooth",
        });
      }
    }, 2500); // 🔥 smooth premium speed

    return () => {
      clearInterval(autoSlideRef.current);
    };
  }, [products.length]);

  /* ---------------- FETCH ALL ---------------- */
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

        const gheeData = ghee.data.map((p) => {
          const weights = p.pricePerGram?.split(",") || [];
          const defaultWeight = weights.length
            ? weights[0].split("=")[0].trim()
            : "";
          return {
            ...p,
            tag: "Ghee",
            productName: p.title,
            cutPrice: p.cutPrice,
            currentPrice: p.currentPrice,
            selectedWeight: defaultWeight, // ✅ default weight
            productImages: p.images,
          };
        });

        const ganpatiData = ganpati.data.map((p) => {
          const defaultPack = p.packs?.[0]?.name || "";
          return {
            ...p,
            tag: "Ganpati",
            productName: p.title,
            cutPrice: p.cut_price,
            currentPrice: p.current_price,
            packs: p.packs || [],
            selectedPack: defaultPack, // ✅ default pack
            productImages: p.images,
          };
        });

        const agarbattiData = agarbatti.data.map((p) => ({
          ...p,
          tag: "Agarbatti",
          productName: p.productName || p.title,
          cutPrice: p.cutPrice,
          currentPrice: p.currentPrice,
          selectedWeight: p.pricePerGram
            ? p.pricePerGram.split(",")[0].split("=")[0].trim()
            : "", // ✅ default weight if any
          productImages: p.productImages,
        }));

        const acharData = achar.data.map((p) => ({
          ...p,
          tag: "Achar",
          productName: p.productName,
          cutPrice: p.cutPrice,
          currentPrice: p.currentPrice,
          selectedWeight: p.pricePerGram
            ? p.pricePerGram.split(",")[0].split("=")[0].trim()
            : "", // ✅ default weight if any
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
      if (!product.selectedWeight) return toast.error("Select weight");
      price = getPriceByWeight(product, product.selectedWeight);
    }

    if (product.packs?.length) {
      if (!product.selectedPack) return toast.error("Select pack");
      price = getPriceByGanpatiPack(product.packs, product.selectedPack);
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
    <div
      className="py-16 px-6 relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: "url('')",
      }}
    >
    <Helmet>
  {/* =========================
      🏆 BEST SELLING PRODUCTS – TITLE
  ========================== */}
  <title>
    Best Selling Homemade Achar, Pure Desi Ghee, Ganpati Murti, Agarbatti & Pooja Products | Gausamvardhan
  </title>

  {/* =========================
      📄 META DESCRIPTION (HIGH CTR)
  ========================== */}
  <meta
    name="description"
    content="Discover best selling products at Gausamvardhan – homemade achar, pure desi cow ghee, ganpati murti, agarbatti, dhoop cups, cow dung products & pooja essentials. Top selling haldi mirchi amla adrak achar, lal mirchi bharwa achar, mango pickle, kathal ka achar, lemon chili pickle, amla murabba & more. Traditional, chemical-free, made in India."
  />

  {/* =========================
      🔗 CANONICAL
  ========================== */}
  <link rel="canonical" href="https://www.gausamvardhan.com/" />

  {/* =========================
      🌐 OPEN GRAPH (SOCIAL SHARE)
  ========================== */}
  <meta property="og:title" content="Best Selling Indian Homemade Products – Gausamvardhan" />
  <meta
    property="og:description"
    content="Shop India’s most loved homemade achar, pure ghee, ganpati murti, agarbatti, dhoop & pooja products. Authentic village-style, no preservatives."
  />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://www.gausamvardhan.com/" />
  <meta property="og:site_name" content="Gausamvardhan" />
  <meta property="og:image" content="https://www.gausamvardhan.com/images/best-selling-og.jpg" />

  {/* =========================
      🐦 TWITTER
  ========================== */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Best Selling Homemade Achar & Desi Products | Gausamvardhan" />
  <meta
    name="twitter:description"
    content="Explore best selling achar, ghee, agarbatti, dhoop, ganpati murti & pooja essentials online."
  />
  <meta name="twitter:image" content="https://www.gausamvardhan.com/images/best-selling-og.jpg" />

  {/* =========================
      🤖 ROBOTS
  ========================== */}
  <meta name="robots" content="index, follow, max-image-preview:large" />

  {/* =========================
      🔥 MEGA KEYWORDS (AMAZON LEVEL)
  ========================== */}
  <meta
    name="keywords"
    content="
    best selling products india,
    trending indian products,
    top selling homemade products,

    homemade achar, desi achar online, traditional indian pickle,
    haldi mirchi amla adrak achar,
    lal mirchi bharwa achar,
    sukha aam ka achar,
    lasun adrak mirchi achar,
    jackfruit pickle, kathal ka achar,
    lemon chili pickle, nimbu mirchi achar,
    amla murabba achar,
    chemical free achar,
    no preservative pickle,
    village style achar,
    maa ke haath ka achar,

    pure desi ghee, a2 cow ghee,
    organic ghee online india,
    cow ghee for pooja,
    bilona ghee,

    ganpati murti online,
    eco friendly ganesh murti,
    clay ganpati murti,
    ganesh idol for pooja,

    agarbatti sticks,
    herbal agarbatti,
    dhoop sticks,
    dhoop cups,
    cow dung dhoop,
    gomay dhoop,

    pooja essentials online,
    pooja samagri store,
    indian religious products,

    handmade indian products,
    made in india products,
    gaav ka saman online,
    bharatiya paramparik utpad,

    घर का बना अचार,
    देसी अचार,
    लाल मिर्च भरवा अचार,
    हल्दी मिर्च अचार,
    आम का अचार,
    कटहल का अचार,
    शुद्ध देसी घी,
    पूजा सामग्री,
    अगरबत्ती,
    धूप,
    गणपति मूर्ति,

    gausamvardhan best sellers
    "
  />

  {/* =========================
      📍 GEO TARGET
  ========================== */}
  <meta name="geo.region" content="IN" />
  <meta name="geo.placename" content="India" />
  <meta name="language" content="English,Hindi" />
</Helmet>
      <div className="relative">
        {/* 🎆 ROCKET CELEBRATION LAYER (TOP) */}
        <div className="absolute inset-x-0 top-0 h-48 pointer-events-none z-20 overflow-visible">
          {Array.from({ length: 20 }).map((_, i) => {
            const item =
              festiveItems[Math.floor(Math.random() * festiveItems.length)];

            return (
              <motion.div
                key={i}
                className="absolute text-xl sm:text-2xl"
                style={{
                  left: `${Math.random() * 100}%`,
                  bottom: "-30px",
                }}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.9,
                }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  y: [-60, -160, -280],
                  rotate: [0, 15, -15, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  delay: Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              >
                {item}
              </motion.div>
            );
          })}
        </div>

        {/* 🧠 HEADING CONTENT */}
        <h2
          className="
    relative z-10
    mt-20
    mb-5 sm:mb-6 md:mb-8
    font-semibold leading-tight tracking-tight
    text-[1rem] sm:text-[1.05rem] md:text-[1.5rem] lg:text-[1.5rem]
    font-poppins
  "
        >
          <span className="text-blue-600">Best</span>{" "}
          <span className="text-orange-500">Selling</span>{" "}
          <span className="text-gray-900">Product</span>
        </h2>
      </div>

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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-6"
      >
        {products.map((item, index) => {
          // ---------------- CALCULATE DISPLAYED PRICE ----------------
          const displayedPrice =
            item.tag === "Ghee" && item.pricePerGram
              ? getPriceByWeight(item, item.selectedWeight)
              : item.packs?.length
              ? getPriceByGanpatiPack(item.packs, item.selectedPack)
              : Number(item.currentPrice); // ensure number

          // ---------------- RENDER BANNER ----------------
          if (item.isBanner) {
            return (
              <div
                key={index}
                className="min-w-[380px] h-[460px] rounded-3xl shadow-lg relative overflow-hidden p-8"
              >
                <div className="absolute inset-0 bg-white/85 backdrop-blur-sm" />
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <p className="text-xs tracking-widest text-green-600 mb-3">
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
            );
          }

          // ---------------- RENDER PRODUCT ----------------
          return (
            <div
              key={item._id}
              onClick={() => handleProductClick(item)}
              className="min-w-[300px] bg-white rounded-3xl p-4 shadow-sm hover:shadow-lg transition flex flex-col justify-between cursor-pointer"
            >
              <img
                src={item.productImages?.[0]}
                className="h-48 w-full object-cover rounded-xl mb-3"
                alt={item.productName}
              />

              <span className="text-orange-500 text-sm font-medium">
                {item.tag}
              </span>

              <h3 className="font-semibold text-lg">{item.productName}</h3>

              <StarRating
                rating={getAvgRating(item.reviews)}
                count={item.reviews?.length || 0}
              />

              <div className="flex items-center gap-2 my-1">
                {item.cutPrice > 0 && (
                  <span className="line-through text-gray-400 text-sm">
                    ₹{item.cutPrice} {/* cutPrice wahi rahe */}
                  </span>
                )}
                <span className="text-lg font-semibold">₹{displayedPrice}</span>{" "}
                {/* dynamic current price */}
                {item.cutPrice > 0 && (
                  <span className="text-sm text-red-500">
                    {getDiscountPercent(item.cutPrice, displayedPrice)}% OFF
                  </span>
                )}
              </div>

              {/* ---------------- WEIGHT SELECT ---------------- */}
              {item.pricePerGram && (
                <select
                  value={item.selectedWeight}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    const value = e.target.value;
                    setProducts((prev) =>
                      prev.map((p) =>
                        p._id === item._id ? { ...p, selectedWeight: value } : p
                      )
                    );
                  }}
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

              {/* ---------------- PACK SELECT ---------------- */}
              {item.packs?.length > 0 && (
                <select
                  value={item.selectedPack}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    setProducts((prev) =>
                      prev.map((p) =>
                        p._id === item._id
                          ? { ...p, selectedPack: e.target.value }
                          : p
                      )
                    );
                  }}
                  className="border px-3 py-2 my-2 rounded-md"
                >
                  {item.packs.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} – ₹{p.price}
                    </option>
                  ))}
                </select>
              )}

              {/* ---------------- ADD TO CART ---------------- */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-3"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          );
        })}{" "}
      </div>
    </div>
  );
};

export default HolidayPicks;
