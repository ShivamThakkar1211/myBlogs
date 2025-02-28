"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import styles from './dash.module.css'

const Page = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Fetch messages from API
  const fetchMessages = async () => {
    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // ✅ Fetch messages on component mount
  useEffect(() => {
    if (session) fetchMessages();
  }, [session]);

  // ✅ Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.username || !content.trim()) return;

    try {
      await axios.post("/api/send-messages", {
        username: user.username,
        content: content,
      });
      setContent(""); // Clear input after submit
      fetchMessages(); // Refresh messages after sending
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // ✅ Handle message deletion
  const handleDelete = async (messageId) => {
    try {
      await axios.delete(`/api/delete-blog/${messageId}`);
      fetchMessages(); // Refresh after deletion
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  return (
    <div className={styles.container}>
      {session ? (
        <>
          <h1 className={styles.heading}>Welcome, {user?.username} 👋</h1>

          {/* ✅ Input Field for Content */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              className={styles.input}
              placeholder="Write your message..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button type="submit" className={styles.button}>
              Send
            </button>
          </form>

          {/* ✅ Display Messages */}
          <div className={styles.messagesContainer}>
            <h2 className={styles.messageHeading}>All Messages</h2>
            <ul className={styles.messageList}>
              {messages.length === 0 ? (
                <p className={styles.noMessages}>No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <li key={msg._id} className={styles.messageItem}>
                    <strong className={styles.username}>{msg.username}:</strong>{" "}
                    {msg.content}
                    {/* {user?.username === msg.username && ( // ✅ Only allow the author to delete */}
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(msg._id)}
                      >
                        ❌ Delete
                      </button>
                    {/* )} */}
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : (
        <h1 className={styles.error}>Please sign in</h1>
      )}
    </div>
  );
};

export default Page;
