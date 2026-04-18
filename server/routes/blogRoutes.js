const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { requireAuth } = require("../middlewares/authMiddleware");
const Blog = require("../models/Blog");
const User = require("../models/User"); // ✅ add this

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { files: 4 } });

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) {
          console.error("CLOUDINARY ERROR:", err);
          return reject(err);
        }

        console.log("UPLOADED URL:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    stream.end(buffer);
  });
}

/* ─── GET /api/blogs ─── */
/* ─── GET /api/blogs ─── */
router.get("/", async (req, res) => {
  try {
    const { place, page = 1, limit = 10 } = req.query;

    let filter = {};

    if (place) {
      filter = {
        place_name: {
          $regex: place,
          $options: "i"   // case-insensitive
        }
      };
    }

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      total,
      page: Number(page)
    });

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

/* ─── GET /api/blogs/:id ─── */
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─── POST /api/blogs ─── */
router.post("/", requireAuth, upload.array("images", 4), async (req, res) => {
  try {
console.log("CONTENT-TYPE:", req.headers["content-type"]);
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);    const { title, body, place_name, place_display_name, visited_on, rating } =
      req.body;

    // ✅ fetch user from DB — avoids needing name in JWT
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const imageUrls = await Promise.all(
      (req.files || []).map((f) =>
        uploadToCloudinary(f.buffer, "heritage-blogs")
      )
    );

    const blog = await Blog.create({
      title,
      body,
      place_name,
      place_display_name,
      author: { id: req.user.id, name: user.name }, // ✅ name from DB
      images: imageUrls,
      visited_on: visited_on || null,
      rating: rating || null,
    });

    res.status(201).json(blog);
  } catch (err) {
  console.error("ERROR DETAILS:", err);
  res.status(500).json({
    error: err.message
  });
}
});

/* ─── DELETE /api/blogs/:id ─── */
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not found" });

    if (blog.author.id.toString() !== req.user.id)
      return res.status(403).json({ error: "Forbidden" });

    await blog.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;