"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from './page.module.css';

export default function BlogMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/blogMessages");
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>🚀 Blog Messages</h1>

      <div className={styles.messagesContainer}>
        {loading ? (
          <p className={styles.loading}>Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className={styles.noMessages}>No messages found.</p>
        ) : (
          <ul className={styles.messagesList}>
            {messages.map((msg, index) => (
              <li key={index} className={styles.message}>
                <h3 className={styles.username}>✍️ {msg.username}</h3> {/* Show username */}
                <p>{msg.content}</p>
                <small className={styles.small}>{new Date(msg.createdAt).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
