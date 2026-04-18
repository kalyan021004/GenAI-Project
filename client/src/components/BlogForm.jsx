// =====================================================
// FILE: src/components/BlogForm.jsx
// =====================================================

import React, { useState } from "react";
import { createBlog } from "../api/postApi";

const BlogForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    placeName: "",
    location: "",
    category: "Temple",
    description: "",
    rating: "",
    visitDate: "",
    tags: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBlog(formData);

      alert(
        "Blog created successfully"
      );

      setFormData({
        title: "",
        placeName: "",
        location: "",
        category: "Temple",
        description: "",
        rating: "",
        visitDate: "",
        tags: "",
        image: null,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-md grid md:grid-cols-2 gap-4"
    >
      <input
        name="title"
        placeholder="Post Title"
        value={formData.title}
        onChange={handleChange}
        className="border p-2 rounded-lg"
        required
      />

      <input
        name="placeName"
        placeholder="Place Name"
        value={formData.placeName}
        onChange={handleChange}
        className="border p-2 rounded-lg"
        required
      />

      <input
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        className="border p-2 rounded-lg"
        required
      />

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="border p-2 rounded-lg"
      >
        <option value="Temple">
          Temple
        </option>
        <option value="Fort">
          Fort
        </option>
        <option value="Museum">
          Museum
        </option>
        <option value="Beach">
          Beach
        </option>
      </select>

      <textarea
        name="description"
        placeholder="Describe your experience"
        value={formData.description}
        onChange={handleChange}
        className="border p-2 rounded-lg md:col-span-2"
      />

      <input
        type="number"
        name="rating"
        min="1"
        max="5"
        placeholder="Rating"
        value={formData.rating}
        onChange={handleChange}
        className="border p-2 rounded-lg"
      />

      <input
        type="date"
        name="visitDate"
        value={formData.visitDate}
        onChange={handleChange}
        className="border p-2 rounded-lg"
      />

      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={formData.tags}
        onChange={handleChange}
        className="border p-2 rounded-lg md:col-span-2"
      />

      <input
        type="file"
        name="image"
        onChange={handleFile}
        className="border p-2 rounded-lg md:col-span-2"
      />

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded-lg md:col-span-2 hover:bg-green-700"
      >
        Submit Blog
      </button>
    </form>
  );
};

export default BlogForm;
