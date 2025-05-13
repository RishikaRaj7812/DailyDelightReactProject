import React, { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thanks for reaching out!");
    setFormData({ name: "", email: "", message: "" });
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(to right, #e0f7fa, #e1f5fe)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      background: "linear-gradient(to right, #00acc1, #00796b)",
      color: "#fff",
      padding: "1.5rem",
      textAlign: "center",
      fontSize: "2rem",
      fontWeight: "bold",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
    },
    main: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "3rem 1rem"
    },
    card: {
      backgroundColor: "#ffffff",
      padding: "2.5rem",
      borderRadius: "1rem",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "600px"
    },
    title: {
      fontSize: "1.8rem",
      color: "#37474f",
      textAlign: "center",
      marginBottom: "1.5rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "600",
      color: "#455a64"
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "1px solid #cfd8dc",
      marginBottom: "1.5rem",
      fontSize: "1rem",
      outline: "none",
      transition: "border 0.2s",
    },
    textarea: {
      width: "100%",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      border: "1px solid #cfd8dc",
      marginBottom: "1.5rem",
      fontSize: "1rem",
      height: "120px",
      resize: "vertical",
      outline: "none"
    },
    button: {
      width: "100%",
      backgroundColor: "#00796b",
      color: "#fff",
      border: "none",
      padding: "0.75rem",
      borderRadius: "0.5rem",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s ease"
    },
    footer: {
      textAlign: "center",
      padding: "1rem",
      fontSize: "0.9rem",
      backgroundColor: "#eceff1",
      color: "#607d8b"
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>Contact Us</header>
      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.title}>We'd love to hear from you!</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              id="name"
              name="name"
              type="text"
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              name="email"
              type="email"
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label htmlFor="message" style={styles.label}>Message</label>
            <textarea
              id="message"
              name="message"
              style={styles.textarea}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message"
              required
            />

            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#004d40")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#00796b")}
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} MyStore. All rights reserved.
      </footer>
    </div>
  );
};

export default ContactUs;
