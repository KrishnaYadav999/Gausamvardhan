import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaShoppingBag } from "react-icons/fa";

const CartButton = () => {
  const { totalItems, totalPrice } = useContext(CartContext);

  return (
    <Link
      to="/cart"
      className="flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded-full relative hover:bg-green-800 transition"
    >
      {/* Bag Icon */}
      <div className="relative">
        <FaShoppingBag className="text-xl" />

        {/* Item Count Badge */}
        <span className="absolute -top-2 -right-2 bg-white text-green-900 rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold">
          {totalItems}
        </span>
      </div>

      {/* Price */}
      <span className="font-medium">Rs. {totalPrice.toFixed(2)}</span>
    </Link>
  );
};

export default CartButton;
