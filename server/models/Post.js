const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  placeName: {
    type: String,
    required: true
  },

  location: {
    type: String,
    required: true
  },

  category: {
    type: String,
    enum: [
      "Temple",
      "Fort",
      "Museum",
      "Monument",
      "Beach",
      "Festival",
      "Other"
    ]
  },

  description: String,

  images: [
    {
      url: String,
      filename: String
    }
  ],

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  visitDate: Date,

  tags: [String],

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);