

const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    try {

        const {
            title,
            placeName,
            location,
            category,
            description,
            rating,
            visitDate,
            tags
        } = req.body;
        const newPost = new Post({
            title,
            placeName,
            location,
            category,
            description,
            rating,
            visitDate,
            tags: tags.split(","),
            image: req.file ? req.file.filename : null
        });

        await newPost.save();

        res.redirect("/blog");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");
    }
};




exports.getPosts = async (req, res) => {
    try {

        let query = {};

        if (req.query.location) {
            query.location = req.query.location;
        }

        if (req.query.category) {
            query.category = req.query.category;
        }

        if (req.query.rating) {
            query.rating = {
                $gte: req.query.rating
            };
        }

        if (req.query.tags) {
            query.tags = {
                $in: req.query.tags.split(",")
            };
        }

        const posts = await Post.find(query)
            .sort({ createdAt: -1 });

        res.render("blog", {
            posts
        });

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");
    }
};


exports.deletePost = async (req, res) => {

    try {

        await Post.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/blog");

    } catch (error) {

        console.error(error);

        res.status(500).send("Server Error");
    }
};