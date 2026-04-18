import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createBlog } from "../api/blogApi";

export default function NewBlogPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    body: "",
    place_name: "",
    place_display_name: "",
    visited_on: "",
    rating: "",
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.body || !form.place_name) {
      setError("Title, body and place are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));
      images.forEach((img) => fd.append("images", img));
      const blog = await createBlog(fd);
      navigate(`/blogs/${blog._id}`);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <Link to="/blogs" style={styles.back}>← Back to Blogs</Link>
      <h1 style={styles.title}>📝 Share Your Visit</h1>

      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.form}>
        <label style={styles.label}>Place Name (slug) *</label>
        <input
          name="place_name"
          value={form.place_name}
          onChange={handleChange}
          placeholder="e.g. rani-ki-vav"
          style={styles.input}
        />

        <label style={styles.label}>Place Display Name</label>
        <input
          name="place_display_name"
          value={form.place_display_name}
          onChange={handleChange}
          placeholder="e.g. Rani ki Vav"
          style={styles.input}
        />

        <label style={styles.label}>Post Title *</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. An unforgettable morning at the stepwell"
          style={styles.input}
        />

        <label style={styles.label}>Your Experience *</label>
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Write about what you saw, felt, learned..."
          rows={8}
          style={{ ...styles.input, resize: "vertical" }}
        />

        <div style={styles.row}>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Date Visited</label>
            <input
              type="date"
              name="visited_on"
              value={form.visited_on}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Rating</label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {"⭐".repeat(n)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label style={styles.label}>Photos (up to 4)</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleImages}
          style={{ marginBottom: "12px" }}
        />
        {previews.length > 0 && (
          <div style={styles.previews}>
            {previews.map((src, i) => (
              <img key={i} src={src} alt="" style={styles.preview} />
            ))}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ ...styles.btn, opacity: submitting ? 0.6 : 1 }}
        >
          {submitting ? "Posting..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { maxWidth: "720px", margin: "0 auto", padding: "40px 20px" },
  back: { color: "#2563eb", textDecoration: "none", fontWeight: 500 },
  title: { fontSize: "28px", fontWeight: 700, margin: "20px 0 28px", color: "#0f172a" },
  form: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#374151", marginTop: "12px" },
  input: {
    padding: "10px 14px", fontSize: "15px", borderRadius: "10px",
    border: "1px solid #d1d5db", outline: "none", width: "100%",
    boxSizing: "border-box",
  },
  row: { display: "flex", gap: "16px" },
  previews: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "8px" },
  preview: { width: "100px", height: "80px", objectFit: "cover", borderRadius: "8px" },
  btn: {
    marginTop: "20px", padding: "12px", background: "#2563eb", color: "#fff",
    border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: 600, cursor: "pointer",
  },
  error: { color: "red", fontSize: "14px" },
};