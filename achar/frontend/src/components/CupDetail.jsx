// CupDetail.jsx
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { Star } from "lucide-react";
import toast from "react-hot-toast";

const HERO_IMAGE_URL =
  "https://res.cloudinary.com/dkmxeiyvp/image/upload/v1732170791/qjngeru4hr5mxs05neqt.png";

const CupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, setCartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedPack, setSelectedPack] = useState("");
  const [packQuantities, setPackQuantities] = useState({});
  const zoomRef = useRef();
  const [zoomStyle, setZoomStyle] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/cup/${id}`);

        const avgRating =
          data.reviews && data.reviews.length > 0
            ? data.reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
              data.reviews.length
            : 0;

        setProduct({ ...data, rating: avgRating });

        if (data.packs?.length > 0) {
          setSelectedPack(data.packs[0].name);
          setPackQuantities({ [data.packs[0].name]: 1 });
        }

        setMainImage(data.images?.[0]);
      } catch (err) {
        toast.error("Error fetching product");
      }
    };

    fetchProduct();
  }, [id]);

  const getPrice = (p, packName) => {
    if (!p) return 0;
    if (!packName) return p.current_price;
    const found = p.packs?.find((pk) => pk.name === packName);
    return found ? Number(found.price) : Number(p.current_price);
  };

  const updatePackQuantity = (pack, change) => {
    setPackQuantities((prev) => {
      const qty = prev[pack] || 1;
      return { ...prev, [pack]: Math.max(1, qty + change) };
    });
  };

  const handleAddToCart = () => {
    if (product.packs?.length > 0 && !selectedPack) {
      toast.error("Please select a pack!");
      return;
    }

    const qty = packQuantities[selectedPack] || 1;

    addToCart({
      ...product,
      selectedPack,
      selectedPrice: getPrice(product, selectedPack),
      quantity: qty,
      totalPrice: getPrice(product, selectedPack) * qty,
      productImages: product.images,
    });

    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if (product.packs?.length > 0 && !selectedPack) {
      toast.error("Please select a pack!");
      return;
    }

    const qty = packQuantities[selectedPack] || 1;

    setCartItems([
      {
        ...product,
        selectedPack,
        selectedPrice: getPrice(product, selectedPack),
        quantity: qty,
        totalPrice: getPrice(product, selectedPack) * qty,
      },
    ]);

    navigate("/checkout");
  };

  const handleMouseMove = (e) => {
    if (!zoomRef.current) return;
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;

    setZoomStyle({
      backgroundImage: `url(${mainImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: "200%",
    });
  };

  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  const totalReviews = product.reviews?.length || 0;
  const averageRating = product.rating?.toFixed(1);

  return (
    <div className="text-[0.9rem] bg-gray-50 min-h-screen">
      <div className="max-w-screen-xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* LEFT SIDE */}
          <div>
            {/* HERO + MAIN IMAGE WITH ZOOM */}
            <div
              ref={zoomRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setZoomStyle({})}
              className="relative bg-white rounded-3xl p-6 shadow-xl overflow-hidden"
            >
              <div className="w-full h-[420px] md:h-[580px] flex items-center justify-center">
                <img
                  src={HERO_IMAGE_URL}
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>

              {/* ACTUAL PRODUCT IMAGE */}
              <div className="absolute left-6 top-10 w-[70%] md:w-[65%] -translate-y-10">
                <img
                  src={mainImage}
                  className="w-full h-[360px] md:h-[460px] object-contain bg-white rounded-xl shadow-lg border-2 border-white"
                />
              </div>

              {zoomStyle.backgroundImage && (
                <div className="absolute inset-0 pointer-events-none" style={zoomStyle} />
              )}
            </div>

            {/* THUMBNAILS */}
            <div className="mt-4 flex gap-3 overflow-x-auto py-2">
              {product.images?.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`border rounded-lg overflow-hidden p-1 ${
                    mainImage === img ? "ring-2 ring-green-400" : "border-gray-200"
                  }`}
                >
                  <img src={img} className="w-20 h-20 object-cover" />
                </button>
              ))}
            </div>

            {/* MORE ABOUT PRODUCT */}
            {product.moreAboutProduct && (
              <div className="mt-6 bg-white p-6 rounded-2xl shadow">
                <h3 className="text-xl font-semibold mb-3">
                  {product.moreAboutProduct.name || "More About"}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {product.moreAboutProduct.description}
                </p>

                <div className="mt-4 grid gap-4">
                  {product.moreAboutProduct.images?.map((img, i) => (
                    <img key={i} src={img} className="rounded-xl w-full" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <div className="sticky top-6 self-start">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

              {/* RATING */}
              <div className="flex items-center mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({totalReviews} reviews)
                </span>
              </div>

              <p className="mt-3 text-gray-700">{product.description}</p>

              {/* PRICE */}
              <div className="mt-6">
                <div className="text-4xl font-bold text-green-600">
                  ₹
                  {getPrice(product, selectedPack) *
                    (packQuantities[selectedPack] || 1)}
                </div>
                {product.cut_price && (
                  <div className="text-gray-400 line-through text-sm">
                    ₹{product.cut_price}
                  </div>
                )}
              </div>

              {/* PACK OPTIONS */}
              {product.packs?.length > 0 && (
                <div className="mt-6">
                  <p className="font-medium text-gray-700 mb-2">Select Pack</p>
                  <div className="flex flex-col gap-3">
                    {product.packs.map((pack, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedPack(pack.name)}
                        className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer ${
                          selectedPack === pack.name
                            ? "border-green-600 bg-green-50"
                            : "border-gray-200"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {pack.name} – ₹
                          {getPrice(product, pack.name) *
                            (packQuantities[pack.name] || 1)}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePackQuantity(pack.name, -1);
                            }}
                            className="px-3 py-1 border rounded"
                          >
                            -
                          </button>

                          <span>{packQuantities[pack.name] || 1}</span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updatePackQuantity(pack.name, 1);
                            }}
                            className="px-3 py-1 border rounded"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA BUTTONS */}
              <div className="mt-6 grid gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl text-lg font-bold"
                >
                  🛒 Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="py-3 bg-yellow-400 hover:bg-yellow-500 rounded-xl text-lg font-semibold"
                >
                  Buy Now
                </button>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="mt-8">
                <h3 className="font-semibold text-xl mb-3">Product Details</h3>

                <ul className="space-y-2 text-gray-700">
                  {product.keyBenefits?.length > 0 && (
                    <li>
                      <b>Key Benefits:</b> {product.keyBenefits.join(", ")}
                    </li>
                  )}

                  {product.ingredients?.length > 0 && (
                    <li>
                      <b>Ingredients:</b> {product.ingredients.join(", ")}
                    </li>
                  )}

                  {product.quantity && (
                    <li>
                      <b>Quantity:</b> {product.quantity}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CupDetail;
