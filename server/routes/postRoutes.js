const express = require("express");

const router = express.Router();

const {
  createPost,
  getPosts,
  deletePost

} = require("../controllers/postController");

const upload = require(
  "../middlewares/upload"
);

router.get(
  "/blog",
  getPosts
);

router.get(
  "/create",
  (req, res) => {
    res.render("createPost");
  }
);
router.post(
  "/create",
  upload.single("image"),
  createPost
);

router.get(
  "/delete/:id",
  deletePost
);

module.exports = router;