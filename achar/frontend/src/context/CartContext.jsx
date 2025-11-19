import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";  

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

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
      const confirmLogin = window.confirm(
        "⚠️ Please login to continue.\n\nTo add this product to your cart, kindly log in to your account first.\n\n⚡ कृपया आगे बढ़ने के लिए लॉगिन करें।\nइस उत्पाद को अपने कार्ट में जोड़ने के लिए पहले अपने अकाउंट में लॉगिन करें।\n\n👉 Do you want to go to the sign in page now?"
      );
      if (confirmLogin) {
        navigate("/signin"); // ✅ Redirect user to login page
      }
      return;
    }

    const price = parseFloat(product.selectedPrice) || 0;

    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) =>
          item._id === product._id &&
          item.selectedWeight === product.selectedWeight &&
          item.selectedVolume === product.selectedVolume &&
           item.selectedPack === product.selectedPack
      );

      if (existingItem) {
        return prev.map((item) =>
          item._id === product._id &&
          item.selectedWeight === product.selectedWeight &&
          item.selectedVolume === product.selectedVolume&&
           item.selectedPack === product.selectedPack
            ? {
                ...item,
                quantity: Math.min(99, item.quantity + (product.quantity || 1)), // max 99
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            ...product,
            quantity: product.quantity || 1,
            currentPrice: price,
          productImages: product.productImages?.length
  ? product.productImages
  : product.images?.length
    ? product.images
    : ["/no-image.png"], // fallbac// fallback image
              selectedPack: product.selectedPack || null, 
          },
        ];
      }
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

  // Totals
  const totalItems = cartItems.reduce(
    (acc, item) => acc + (parseInt(item.quantity) || 0),
    0
  );
  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + (parseFloat(item.currentPrice) || 0) * (parseInt(item.quantity) || 0),
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
}; 