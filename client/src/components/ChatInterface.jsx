import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/chatApi";

const SUGGESTIONS = [
  "Tell me the history as a story",
  "What should I not miss when visiting?",
  "Explain the architecture simply",
  "What myths are tied to this place?",
];

export default function ChatInterface({ site }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Namaste! I am your AI guide for ${site.name}. Ask me anything about its history, architecture, myths, or plan your visit.`,
    },
  ]);

  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    if (!text.trim() || streaming) return;

    const newMessages = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);
    setInput("");
    setStreaming(true);

    try {
      const res = await sendChatMessage(newMessages, {
        name: site.name,
        dynasty_or_period: site.dynasty_or_period,
        architectural_style: site.architectural_style,
        historical_background: site.historical_background,
        cultural_significance: site.cultural_significance,
        legends_and_stories: site.legends_and_stories,
        visitor_info: site.visitor_info,
      });

      // Add assistant placeholder
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "" },
      ]);

      // Detect streaming support
      if (!res.body) {
        // Fallback: normal JSON response
        const data = await res.json();
        const text =
          data.response || data.answer || data.message || "No response";

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: text };
          return updated;
        });

        return;
      }

      // STREAMING MODE
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;

            try {
              const { token } = JSON.parse(data);
              if (token) {
                assistantText += token;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                  };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Error generating response",
        };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div>
      {messages.length <= 1 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
            marginBottom: "16px",
          }}
        >
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              style={{
                fontSize: "12px",
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "20px",
                background: "#fff",
                color: "#374151",
                cursor: "pointer",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxHeight: "400px",
          overflowY: "auto",
          marginBottom: "16px",
          paddingRight: "4px",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "78%",
                padding: "10px 14px",
                fontSize: "14px",
                lineHeight: "1.65",
                borderRadius:
                  m.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                background: m.role === "user" ? "#2563eb" : "#f3f4f6",
                color: m.role === "user" ? "#fff" : "#111",
              }}
            >
              {/* ✅ FIXED: was m.content || (...) ? "▋" : "" which always showed ▋ */}
              {m.content
                ? m.content
                : streaming && m.role === "assistant"
                ? "▋"
                : ""}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Ask about history, myths, architecture..."
          disabled={streaming}
          style={{
            flex: 1,
            padding: "10px 14px",
            fontSize: "14px",
            border: "1px solid #d1d5db",
            borderRadius: "10px",
            outline: "none",
          }}
        />

        <button
          onClick={() => send(input)}
          disabled={streaming || !input.trim()}
          style={{
            padding: "10px 20px",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: 500,
            opacity: streaming || !input.trim() ? 0.5 : 1,
          }}
        >
          {streaming ? "▋" : "Send"}
        </button>
      </div>
    </div>
  );
}