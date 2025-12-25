import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FaStar, FaTimes } from "react-icons/fa";

const GanpatiCustomerReview = ({ image, onSubmitted }) => {
  const { id } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [images, setImages] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddReview = async () => {
    if (!name.trim() || !review.trim() || rating <= 0) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name,
        comment: review,
        rating,
        images: images ? images.split(",").map((u) => u.trim()) : [],
      };

      const { data } = await axios.post(`/api/ganpati/review/${id}`, payload);

      toast.success("Review added successfully!");

      setName("");
      setReview("");
      setRating(5);
      setImages("");
      setIsModalOpen(false);

      if (typeof onSubmitted === "function") onSubmitted(data);
    } catch (error) {
      toast.error("Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      {image && (
        <img
          src={image}
          alt="Product"
          className="w-full h-52 rounded-xl object-cover shadow-lg mb-4"
        />
      )}

      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-yellow-500 text-white rounded-md font-medium text-sm shadow-sm hover:bg-yellow-600 transition-colors duration-200"
      >
          Add Your Review
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 px-3">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-6 relative animate-scaleIn max-h-[90vh] overflow-y-auto">

            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-4">
              Add Your Review
            </h2>

            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-yellow-400"
            />

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={26}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer transition-all ${
                    rating >= star
                      ? "text-yellow-400 drop-shadow-md"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            <textarea
              rows="4"
              placeholder="Write your review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-yellow-400"
            />

            <input
              type="text"
              placeholder="Image URLs (comma separated)"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-yellow-400"
            />

            <button
              onClick={handleAddReview}
              disabled={submitting}
              className={`w-full py-2.5 rounded-lg text-white font-semibold shadow-md transition-all ${
                submitting
                  ? "bg-yellow-300 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GanpatiCustomerReview;
