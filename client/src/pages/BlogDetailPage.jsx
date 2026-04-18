import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog } from "../api/blogApi";

export default function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current user from your auth context/localStorage
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    getBlogById(id)
      .then(setBlog)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    await deleteBlog(id);
    navigate("/blogs");
  };

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (!blog) return <div style={styles.center}>Post not found.</div>;

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <Link to="/blogs" style={styles.back}>← All Blogs</Link>
        <Link to={`/site/${blog.place_name}`} style={styles.siteLink}>
          View {blog.place_display_name} →
        </Link>
      </div>

      <p style={styles.placeBadge}>{blog.place_display_name}</p>
      <h1 style={styles.title}>{blog.title}</h1>

      <div style={styles.meta}>
        <span>✍️ {blog.author?.name}</span>
        {blog.visited_on && (
          <span>📅 {new Date(blog.visited_on).toDateString()}</span>
        )}
        {blog.rating && <span>{"⭐".repeat(blog.rating)}</span>}
      </div>

      {blog.images?.length > 0 && (
        <div style={styles.gallery}>
          {blog.images.map((src, i) => (
            <img key={i} src={src} alt="" style={styles.galleryImg} />
          ))}
        </div>
      )}

      <div style={styles.body}>
        {blog.body.split("\n").map((para, i) => (
          <p key={i} style={{ marginBottom: "16px" }}>{para}</p>
        ))}
      </div>

      {currentUserId === blog.author?.id && (
        <button onClick={handleDelete} style={styles.deleteBtn}>
          🗑️ Delete Post
        </button>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "800px", margin: "0 auto", padding: "40px 20px" },
  topBar: { display: "flex", justifyContent: "space-between", marginBottom: "24px" },
  back: { color: "#2563eb", textDecoration: "none", fontWeight: 500 },
  siteLink: { color: "#2563eb", textDecoration: "none", fontWeight: 500 },
  placeBadge: { fontSize: "13px", color: "#2563eb", fontWeight: 600, marginBottom: "6px" },
  title: { fontSize: "32px", fontWeight: 700, color: "#0f172a", marginBottom: "12px" },
  meta: { display: "flex", gap: "20px", fontSize: "14px", color: "#64748b", marginBottom: "24px" },
  gallery: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "12px", marginBottom: "32px" },
  galleryImg: { width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px" },
  body: { fontSize: "17px", lineHeight: 1.85, color: "#334155" },
  deleteBtn: {
    marginTop: "32px", padding: "10px 20px", background: "#ef4444",
    color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px",
  },
  center: { height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
};