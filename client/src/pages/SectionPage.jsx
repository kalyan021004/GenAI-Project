import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSiteSection } from "../api/siteApi";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://genai-project-65m3.onrender.com";

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

        const data = await getSiteSection(slug, section);

        setContent(data.content || "No detailed information available.");

        // ✅ FIXED: use full backend URL, not relative /api/image
        const res = await fetch(
          `${API_BASE}/api/image?query=${data.keywords}`
        );

        // ✅ FIXED: guard against HTML error pages before parsing JSON
        if (!res.ok) {
          console.error("Image fetch failed with status:", res.status);
          setImages([]);
        } else {
          const img = await res.json();
          setImages(img.images || []);
        }

      } catch (err) {
        console.error(err);
        setError("Failed to load section content.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, section]);

  if (loading)
    return <div style={styles.loader}>Loading...</div>;

  if (error)
    return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <Link to={`/site/${slug}`} style={styles.back}>
        ← Back to Site
      </Link>

      <h1 style={styles.title}>
        {getIcon(section)} {formatTitle(section)}
      </h1>

      <div style={styles.gallery}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="site"
            style={styles.galleryImage}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          />
        ))}
      </div>

      <div style={styles.contentCard}>
        <div
          style={styles.text}
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>
    </div>
  );
}

function formatTitle(section) {
  return section
    .replace("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getIcon(section) {
  const icons = {
    history: "📜",
    architecture: "🏛️",
    culture: "🎭",
    visitor: "🧭",
  };
  return icons[section] || "📖";
}

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
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "28px",
  },
  galleryImage: {
    width: "100%",
    height: "160px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
    transition: "0.25s",
    cursor: "pointer",
  },
  contentCard: {
    background: "#ffffff",
    padding: "26px",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
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