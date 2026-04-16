// src/api/chatApi.js

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export const sendChatMessage = async (
  messages,
  site_context
) => {

  const token =
    localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE_URL}/api/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
        Authorization:
          `Bearer ${token}`
      },
      body: JSON.stringify({
        messages,
        site_context
      })
    }
  );

  if (!res.ok) {
    throw new Error(
      `Request failed: ${res.status}`
    );
  }

  return res;
};