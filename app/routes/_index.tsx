//app/routes/_index.tsx
import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [ws, setWs] = useState<WebSocket | null>(null); // Initialize WebSocket state

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4000");
    setWs(socket); // Store WebSocket instance in state

    socket.onopen = () => {
      console.log("Connected to the WebSocket server");
    };

    socket.onmessage = (event) => {
      // Handle incoming messages
      const chatLog = document.getElementById(
        "chatLog"
      ) as HTMLTextAreaElement | null;
      if (chatLog) {
        chatLog.value += event.data + "\n";
        chatLog.scrollTop = chatLog.scrollHeight; // Auto-scroll to the bottom
      }
    };

    return () => {
      // Clean up WebSocket connection if necessary
      socket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    const messageInput = document.getElementById(
      "messageInput"
    ) as HTMLInputElement | null;
    if (messageInput && ws) {
      const message = messageInput.value;
      ws.send(message);
      messageInput.value = "";
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Remix-Chat-App</h1>
      <h2>Simple Chat Demo (uWebSockets.js)</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "top",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ flex: 1, padding: "20px" }}>
          <label
            htmlFor="chatLog"
            style={{ display: "block", marginBottom: "10px" }}
          >
            Chat Log
          </label>
          <textarea
            id="chatLog"
            readOnly
            style={{ width: "100%", height: "300px", resize: "none" }}
          ></textarea>
        </div>

        <form onSubmit={sendMessage}>
          <div style={{ flex: 1, padding: "20px" }}>
            <input
              type="text"
              id="messageInput"
              placeholder="type message here..."
              style={{ width: "100%", boxSizing: "border-box" }}
            />
            <button type="submit" style={{ marginTop: "10px" }}>
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
