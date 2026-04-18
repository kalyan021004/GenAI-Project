// =====================================================
// FILE: src/components/BlogCard.jsx
// =====================================================

import React from "react";

// Using same base URL configuration from baseApi.js
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const BlogCard = ({ blog, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition">
      {blog.image && (
        <img
          src={`${API_BASE_URL}/uploads/${blog.image}`}
          alt="place"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-4">
        <h3 className="text-lg font-bold">
          {blog.title}
        </h3>

        <p className="text-sm text-gray-600">
          📍 {blog.placeName}
        </p>

        <p className="text-sm text-gray-600">
          {blog.location}
        </p>

        <p className="text-yellow-500 font-semibold">
          ⭐ {blog.rating}
        </p>

        <p className="text-sm mt-2">
          {blog.description}
        </p>

        <button
          onClick={() => onDelete(blog._id)}
          className="mt-3 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BlogCard;