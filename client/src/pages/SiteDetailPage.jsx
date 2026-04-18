import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

/* IMPORTANT: import BOTH functions */
import {
  getSiteBySlug,
  generateSite
} from "../api/siteApi";

import AiBadge from "../components/AiBadge";
import SiteHero from "../components/SiteHero";

/* Button style helper */

const btn = (extra = {}) => ({
  padding: "10px 20px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: 500,
  display: "inline-block",
  textDecoration: "none",
  border: "none",
  cursor: "pointer",
  transition: "0.2s",
  ...extra
});

export default function SiteDetailPage() {

  const { slug } = useParams();

  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  /* FETCH SITE */

  useEffect(() => {
    fetchSite();
  }, [slug]);

  const fetchSite = async () => {

    try {

      setLoading(true);

      /* decode slug (handles %20 spaces) */

      const decodedSlug =
        decodeURIComponent(slug);

      console.log(
        "Fetching site:",
        decodedSlug
      );

      let data;

      try {

        /* Try existing site */

        data =
          await getSiteBySlug(
            decodedSlug
          );

      } catch (err) {

        console.log(
          "Site not found, generating..."
        );

        /* Generate new site */

        data =
          await generateSite(
            decodedSlug
          );

      }

      setSite(data);

    } catch (error) {

      console.error(
        "Error loading site:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  /* LOADING */

  if (loading)
    return (
      <div style={styles.loader}>
        Loading site details...
      </div>
    );

  /* NOT FOUND */

  if (!site)
    return (
      <div style={styles.loader}>
        Site not found.
      </div>
    );

  return (

    <main style={styles.container}>

      {/* BACK */}

      <Link
        to="/"
        style={styles.back}
      >
        ← Back to search
      </Link>

      {/* AI BADGE */}

      {site.data_source ===
        "ai_generated" && (
        <AiBadge />
      )}

      {/* HERO */}

      <SiteHero site={site} />

      {/* BUTTON ROW */}

      <div style={styles.buttonRow}>

        {site.virtual_tour_links
          ?.length > 0 && (

          <Link
            to={`/tour/${site.slug}`}
            style={btn({
              background: "#2563eb",
              color: "#fff"
            })}
          >
            🎥 Virtual Tour
          </Link>

        )}

        <Link
          to={`/chat/${site.slug}`}
          style={btn({
            background: "#fff",
            color: "#374151",
            border:
              "1px solid #d1d5db"
          })}
        >
          🤖 Ask AI Guide
        </Link>

        <Link
          to={`/quiz/${site.slug}`}
          style={btn({
            background: "#fff",
            color: "#374151",
            border:
              "1px solid #d1d5db"
          })}
        >
          🧠 Take Quiz
        </Link>

        <Link
          to="/explore"
          style={btn({
            background: "#fff",
            color: "#374151",
            border:
              "1px solid #d1d5db"
          })}
        >
          🗺️ Explore Map
        </Link>

      </div>

      {/* SECTIONS */}

      <SectionCard
        title="History"
        icon="📜"
        summary={
          site.historical_background
        }
        link={`/site/${site.slug}/history`}
      />

      <SectionCard
        title="Architecture"
        icon="🏛️"
        summary={
          site.architectural_style
        }
        link={`/site/${site.slug}/architecture`}
      />

      <SectionCard
        title="Culture"
        icon="🎭"
        summary={
          site.cultural_significance
        }
        link={`/site/${site.slug}/culture`}
      />

      <SectionCard
        title="Visitor Information"
        icon="🧭"
        summary={
          site.visitor_info
            ?.how_to_reach
        }
        link={`/site/${site.slug}/visitor`}
      />

    </main>

  );

}

/* SECTION CARD */

function SectionCard({
  title,
  icon,
  summary,
  link
}) {

  return (

    <Link
      to={link}
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-5px)";
        e.currentTarget.style.boxShadow =
          "0 10px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.06)";
      }}
    >

      <h3 style={styles.cardTitle}>
        {icon} {title}
      </h3>

      <p style={styles.cardText}>

        {summary
          ? summary.slice(0, 140) + "..."
          : "Click to read detailed information"}

      </p>

      <span style={styles.readMore}>
        Read more →
      </span>

    </Link>

  );

}

/* STYLES */

const styles = {

  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "32px 16px",
    background: "#f9fafb",
    minHeight: "100vh"
  },

  loader: {
    padding: "60px",
    textAlign: "center",
    color: "#9ca3af"
  },

  back: {
    fontSize: "13px",
    color: "#6b7280",
    display: "block",
    marginBottom: "16px",
    textDecoration: "none"
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "28px"
  },

  card: {
    padding: "20px",
    borderRadius: "12px",
    background: "#fff",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.06)",
    marginBottom: "16px",
    transition: "0.2s",
    textDecoration: "none",
    display: "block"
  },

  cardTitle: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    color: "#111827"
  },

  cardText: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: 1.5,
    marginBottom: "10px"
  },

  readMore: {
    fontSize: "13px",
    color: "#2563eb",
    fontWeight: 500
  }

};