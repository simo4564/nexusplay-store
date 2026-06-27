"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: "",
    genre: "",
    developer: "",
    releaseDate: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!session) {
    return <div className="container" style={{paddingTop: '120px'}}><h2>Access Denied. Please login.</h2></div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Game successfully added to the store!");
        setFormData({ title: "", description: "", price: "", imageUrl: "", genre: "", developer: "", releaseDate: "" });
        router.refresh();
      } else {
        setMessage("Error adding game.");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className="text-gradient">Admin Dashboard</h1>
        <p className={styles.subtitle}>Add new masterprices to the store</p>
      </div>

      <div className={styles.formCard}>
        {message && (
          <div className={message.includes("Error") ? styles.error : styles.success}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label>Game Title</label>
            <input name="title" value={formData.title} onChange={handleChange} required className={styles.input} />
          </div>
          <div className={styles.inputGroup}>
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className={styles.input} rows={4} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.inputGroup}>
              <label>Price ($)</label>
              <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label>Genre</label>
              <input name="genre" value={formData.genre} onChange={handleChange} required className={styles.input} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className={styles.inputGroup}>
              <label>Developer</label>
              <input name="developer" value={formData.developer} onChange={handleChange} required className={styles.input} />
            </div>
            <div className={styles.inputGroup}>
              <label>Release Date</label>
              <input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleChange} required className={styles.input} />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>Image URL</label>
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className={styles.input} placeholder="https://..." />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '1rem' }} disabled={loading}>
            {loading ? "Adding Game..." : "Add Game to Store"}
          </button>
        </form>
      </div>
    </div>
  );
}
