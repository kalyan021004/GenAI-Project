import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllBlogs } from "../api/blogApi";

export default function BlogPage() {

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const place =
    searchParams.get("place") || "";

  const [searchText,
    setSearchText] =
    useState(place);

  useEffect(() => {
    fetchBlogs();
  }, [place]);

  const fetchBlogs = async () => {

    setLoading(true);

    try {

      const data =
        await getAllBlogs({
          place,
          limit: 20
        });

      setBlogs(data.blogs);

    } finally {

      setLoading(false);

    }

  };

  /* SEARCH */

  const handleSearch = () => {

    if (searchText.trim()) {

      setSearchParams({
        place: searchText.trim()
      });

    } else {

      setSearchParams({});

    }

  };

  /* CLEAR */

  const clearSearch = () => {

    setSearchText("");

    setSearchParams({});

  };

  if (loading)
    return (
      <div style={styles.center}>
        Loading blogs...
      </div>
    );

  return (

    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        <h1 style={styles.title}>
          🗺️ {
            place
              ? `Visitor Posts — ${place}`
              : "All Visitor Blogs"
          }
        </h1>

        <Link
          to="/blogs/new"
          style={styles.newBtn}
        >
          + Write a Post
        </Link>

      </div>

      {/* SEARCH BAR */}

      <div style={styles.searchBar}>

        <input
          type="text"
          placeholder="Search by place (e.g., Tirumala)"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter")
              handleSearch();
          }}
          style={styles.input}
        />

        <button
          onClick={handleSearch}
          style={styles.searchBtn}
        >
          Search
        </button>

        {place && (
          <button
            onClick={clearSearch}
            style={styles.clearBtn}
          >
            Clear
          </button>
        )}

      </div>

      {/* EMPTY */}

      {blogs.length === 0 && (

        <p style={{ color: "#64748b" }}>
          No posts found for this place.
        </p>

      )}

      {/* BLOG GRID */}

      <div style={styles.grid}>

        {blogs.map((blog) => (

          <Link
            key={blog._id}
            to={`/blogs/${blog._id}`}
            style={styles.card}
          >

            {blog.images?.[0] && (

              <img
                src={blog.images[0]}
                alt={blog.title}
                style={styles.cardImage}
              />

            )}

            <div style={styles.cardBody}>

              <p style={styles.placeName}>
                {blog.place_display_name}
              </p>

              <h2 style={styles.cardTitle}>
                {blog.title}
              </h2>

              <p style={styles.cardSnippet}>
                {blog.body.slice(0, 120)}...
              </p>

              <div style={styles.cardMeta}>

                <span>
                  ✍️ {blog.author?.name}
                </span>

                {blog.rating && (
                  <span>
                    {"⭐".repeat(blog.rating)}
                  </span>
                )}

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>

  );

}

const styles = {

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 20px"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },

  title: {
    fontSize: "28px",
    fontWeight: 700
  },

  newBtn: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: 600
  },

  searchBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px"
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },

  searchBtn: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  clearBtn: {
    padding: "10px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "24px"
  },

  card: {
    textDecoration: "none",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow:
      "0 4px 16px rgba(0,0,0,0.08)",
    background: "#fff"
  },

  cardImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover"
  },

  cardBody: {
    padding: "16px"
  },

  placeName: {
    fontSize: "12px",
    color: "#2563eb",
    fontWeight: 600
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: 700
  },

  cardSnippet: {
    fontSize: "14px",
    color: "#64748b"
  },

  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px"
  },

  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }

};