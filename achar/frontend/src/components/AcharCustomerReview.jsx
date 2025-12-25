/* ---------------------------------------------------
    IMPORTS
----------------------------------------------------*/
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FaStar, FaTimes } from "react-icons/fa";

const AcharCustomerReview = ({ image }) => {
  const { id } = useParams();

  // ---------------- STATES ----------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState(""); // comma separated URLs

  // ---------------- ADD REVIEW ----------------
  const handleAddReview = async () => {
    if (!name.trim() || !review.trim() || rating <= 0) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      await axios.post(`/api/products/${id}/reviews`, {
        name,
        comment: review,
        rating,
        images: images ? images.split(",").map((url) => url.trim()) : [],
      });

      toast.success("Review added successfully!");
      setName("");
      setReview("");
      setRating(5);
      setImages("");
      setIsModalOpen(false); // close modal after submit
    } catch (error) {
      console.error("Review Error:", error);
      toast.error("Failed to add review");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      {/* IMAGE */}
      {image && (
        <img
          src={image}
          alt="Product"
          className="w-full h-56 object-cover rounded-xl mb-5 shadow-md"
        />
      )}

      {/* BUTTON TO OPEN MODAL */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded-md font-medium text-sm shadow-sm hover:bg-yellow-600 transition-colors duration-200"
      >
        Add Your Review
      </button>

      {/* ---------------- MODAL ---------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative shadow-xl">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FaTimes size={22} />
            </button>

            {/* HEADING */}
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
              Add Your Review
            </h2>

            {/* NAME FIELD */}
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            />

            {/* RATING STARS */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={28}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer mx-1 transition-all duration-200 ${
                    rating >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* COMMENT */}
            <textarea
              rows="4"
              placeholder="Write your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            ></textarea>

            {/* IMAGE URLS */}
            <input
              type="text"
              placeholder="Image URLs (comma separated)"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mt-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
            />

            {/* SUBMIT BUTTON */}
            <button
              onClick={handleAddReview}
              className="w-full bg-yellow-500 text-white py-3 rounded-lg mt-5 font-semibold text-lg shadow-md hover:bg-yellow-600 transition-all duration-300"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcharCustomerReview;
