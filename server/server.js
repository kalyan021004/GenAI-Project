require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const blogRoutes = require("./routes/blogRoutes");

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://gen-ai-project-n545.vercel.app",
      "https://gen-ai-project-h3hs.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
  })
);
app.use(express.json());

// Routes (added per phase)
app.use('/api/sites', require('./routes/siteRoutes'));
app.use('/api/tour',  require('./routes/tourRoutes'));
app.use('/api/chat',  require('./routes/chatRoutes'));
app.use('/api/quiz',  require('./routes/quizRoutes'));
app.use('/api/trail', require('./routes/trailRoutes'));
app.use("/api/image", require("./routes/imageRoute"));

app.use("/api/posts",require("./routes/postRoutes"));
app.use("/api/blogs", blogRoutes);


app.use(
  "/api/auth",
  require("./routes/authRoutes")
);
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

module.exports = app;