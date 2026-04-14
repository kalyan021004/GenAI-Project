import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

/* ================================
   LOGIN PAGE
================================ */

export function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (data.token) {

        localStorage.setItem(
          "token",
          data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        navigate("/");
        window.location.reload();

      }

      else {

        alert(data.message);

      }

    }

    catch (err) {

      console.error(err);
      alert("Login failed");

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div style={styles.container}>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        <h2 style={styles.title}>
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        <p style={styles.text}>
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>

      </form>

    </div>

  );

}

/* ================================
   REGISTER PAGE
================================ */

export function RegisterPage() {

  const navigate = useNavigate();

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await fetch(
        "https://genai-project-65m3.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await res.json();

      if (res.ok) {

        alert(
          "Registration successful"
        );

        navigate("/login");

      }

      else {

        alert(data.message);

      }

    }

    catch (err) {

      console.error(err);
      alert(
        "Registration failed"
      );

    }

    finally {

      setLoading(false);

    }

  };

  return (

    <div style={styles.container}>

      <form
        onSubmit={handleSubmit}
        style={styles.form}
      >

        <h2 style={styles.title}>
          Register
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          required
          style={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          required
          style={styles.input}
        />

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading
            ? "Registering..."
            : "Register"}
        </button>

        <p style={styles.text}>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </form>

    </div>

  );

}

/* ================================
   STYLES
================================ */

const styles = {

  container: {
  height: "100vh",
  width: "100%",

  display: "flex",
  justifyContent: "center",
  alignItems: "center",

  overflow: "hidden",

  backgroundImage:
    'url("https://images.unsplash.com/photo-1601823984263-b87b59798b70")',

  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat"
},

  form: {
    width: "340px",

    padding: "28px",

    display: "flex",
    flexDirection: "column",
    gap: "14px",

    /* GLASS EFFECT */

    background: "rgba(255,255,255,0.18)",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.3)",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.25)"
  },

  title: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center"
  },

  text: {
    color: "#ffffff",
    textAlign: "center"
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db"
  },

  button: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  }

};