import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSiteSection } from "../api/siteApi";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";
/* Format text content */
function formatContent(text) {
  if (!text) return "";

  return text
    .replace(
      /\*\*(.*?)\*\*/g,
      "<br/><br/><strong style='font-size:20px;color:#0f172a'>$1</strong><br/><br/>"
    )
    .replace(/\n/g, "<br/>");
}

export default function SectionPage() {
  const { slug, section } = useParams();

  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        /* STEP 1 — Get section content */
        const data = await getSiteSection(slug, section);

        console.log("Section data:", data);

        setContent(
          data?.content || "No detailed information available."
        );

        /* STEP 2 — Prepare safe query */
        const query =
          data?.keywords ||
          slug ||
          section ||
          "heritage site";

        console.log("Image query:", query);

        /* STEP 3 — Fetch images */
        const imageURL = `${API_BASE}/api/image?query=${encodeURIComponent(
          query
        )}`;

        console.log("Fetching images from:", imageURL);

        const res = await fetch(imageURL);

        console.log("Image response status:", res.status);

        if (!res.ok) {
          console.error("Image fetch failed");
          setImages([]);
        } else {
          const img = await res.json();

          console.log("Image response data:", img);

          setImages(img?.images || []);
        }
      } catch (err) {
        console.error("Load error:", err);
        setError("Failed to load section content.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, section]);

  /* Loading state */
  if (loading)
    return (
      <div style={styles.loader}>
        Loading...
      </div>
    );

  /* Error state */
  if (error)
    return (
      <div style={styles.error}>
        {error}
      </div>
    );

  return (
    <div style={styles.container}>
      {/* Back button */}
      <Link to={`/site/${slug}`} style={styles.back}>
        ← Back to Site
      </Link>

      {/* Title */}
      <h1 style={styles.title}>
        {getIcon(section)} {formatTitle(section)}
      </h1>

      {/* Image Gallery */}
      <div style={styles.gallery}>
        {images.length === 0 ? (
          <div style={styles.noImages}>
            No images available
          </div>
        ) : (
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="site"
              style={styles.galleryImage}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform =
                  "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  "scale(1)")
              }
              onError={(e) => {
                console.log("Image failed:", img);

                e.target.src =
                  "https://via.placeholder.com/400x300?text=No+Image";
              }}
            />
          ))
        )}
      </div>

      {/* Content */}
      <div style={styles.contentCard}>
        <div
          style={styles.text}
          dangerouslySetInnerHTML={{
            __html: formatContent(content),
          }}
        />
      </div>
    </div>
  );
}

/* Title formatting */
function formatTitle(section) {
  return section
    .replace("_", " ")
    .replace(/\b\w/g, (c) =>
      c.toUpperCase()
    );
}

/* Icons */
function getIcon(section) {
  const icons = {
    history: "📜",
    architecture: "🏛️",
    culture: "🎭",
    visitor: "🧭",
  };

  return icons[section] || "📖";
}

/* Styles */
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px",
    background: "#f8fafc",
    minHeight: "100vh",
  },

  back: {
    textDecoration: "none",
    color: "#2563eb",
    fontWeight: 500,
    marginBottom: "20px",
    display: "inline-block",
  },

  title: {
    fontSize: "32px",
    fontWeight: 600,
    marginBottom: "26px",
    color: "#0f172a",
  },

  gallery: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },

  galleryImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow:
      "0 4px 10px rgba(0,0,0,0.08)",
    transition: "0.25s",
    cursor: "pointer",
  },

  noImages: {
    padding: "20px",
    textAlign: "center",
    color: "#64748b",
  },

  contentCard: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "16px",
    boxShadow:
      "0 8px 20px rgba(0,0,0,0.06)",
  },

  text: {
    fontSize: "17px",
    lineHeight: 1.85,
    color: "#334155",
  },

  loader: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
  },

  error: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "18px",
    color: "red",
  },
};