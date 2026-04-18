const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    place_name: { type: String, required: true },
    place_display_name: { type: String },
    author: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: { type: String },
    },
    images: [{ type: String }],
    visited_on: { type: Date },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);