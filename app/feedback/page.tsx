"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const resp = await fetch("http://localhost:4000/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message, rating }),
    });

    if (resp.ok) {
      alert("Feedback submitted successfully ✅");
      setName("");
      setEmail("");
      setMessage("");
      setRating(5);
    } else {
      alert("Error submitting feedback ❌");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Give Feedback 🌿</h1>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
        <input
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Your Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
}