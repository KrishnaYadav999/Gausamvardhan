import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState(null); // applied coupon
  const [discountAmount, setDiscountAmount] = useState(0);

  // Load cart for the logged-in user
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem(`cart_${user._id}`);
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (err) {
          console.error("Failed to parse cart from localStorage", err);
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [user]);

  // Save cart to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`cart_${user._id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Clear cart automatically on logout
  useEffect(() => {
    if (!user) {
      setCartItems([]);
    }
  }, [user]);

  // Add product to cart

  const addToCart = (product) => {
    if (!user) {
      if (window.confirm("Please login to add items to cart")) {
        navigate("/signin");
      }
      return;
    }

    const price = parseFloat(product.selectedPrice) || 0;

    // ✅ UNIQUE KEY FOR SAME PRODUCT VARIANT
    const cartKey = `${product._id}_${product.selectedWeight || ""}_${
      product.selectedVolume || ""
    }_${product.selectedPack || ""}`;

    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.cartKey === cartKey);

      // ✅ SAME ITEM → increase quantity
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          quantity: Math.min(99, updated[index].quantity + 1),
        };
        return updated;
      }

      // ✅ NEW ITEM
      return [
        {
          ...product,
          cartKey, // 🔥 VERY IMPORTANT
          quantity: 1,
          basePrice: price,
          currentPrice: price,
          productImages: product.productImages?.length
            ? product.productImages
            : product.images?.length
            ? product.images
            : ["/no-image.png"],
        },
        ...prev,
      ];
    });
  };

  // Update quantity
  const updateQuantity = (id, weight, volume, change, pack) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id &&
        item.selectedWeight === weight &&
        item.selectedVolume === volume &&
        item.selectedPack === pack
          ? {
              ...item,
              quantity: Math.min(99, Math.max(1, item.quantity + change)), // min 1, max 99
            }
          : item
      )
    );
  };

  // Remove item
  const removeFromCart = (id, weight, volume) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item._id === id &&
            item.selectedWeight === weight &&
            item.selectedVolume === volume
          )
      )
    );
  };

  const applyCoupon = (couponObj) => {
    if (
      !couponObj ||
      (!couponObj.isPermanent && new Date(couponObj.expiryDate) < new Date())
    ) {
      toast("Invalid or expired coupon");
      return;
    }

    let discount = 0;
    let updatedCart = [...cartItems];

    if (couponObj.discountType === "percentage") {
      updatedCart = updatedCart.map((item) => ({
        ...item,
        currentPrice:
          parseFloat(item.currentPrice) -
          (parseFloat(item.currentPrice) * couponObj.discountValue) / 100,
      }));
    } else if (couponObj.discountType === "flat") {
      discount = couponObj.discountValue;
      updatedCart = updatedCart.map((item) => ({
        ...item,
        currentPrice: Math.max(0, parseFloat(item.currentPrice) - discount),
      }));
    }

    setCartItems(updatedCart);
    setCoupon(couponObj);
    toast(`Coupon ${couponObj.code} applied!`);
  };

  // Totals
  const totalItems = cartItems.reduce(
    (acc, item) => acc + (parseInt(item.quantity) || 0),
    0
  );
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc +
      (parseFloat(item.currentPrice) || 0) * (parseInt(item.quantity) || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        totalItems,
        totalPrice,
        setCartItems, // ✅ Export this for Buy Now
        coupon,
        discountAmount,
        applyCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
