import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiActivity, FiFileText, FiBarChart2, FiUsers } from "react-icons/fi";

export default function HomePage() {
  const styles = {
    homeContainer: {
      fontFamily: "Segoe UI, Arial, sans-serif",
      color: "#1a1a1a",
      backgroundColor: "#f4f6f8",
    },

    /* HERO SECTION */
    hero: {
      position: "relative",
      height: "70vh",
      backgroundImage:
        "url('https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&q=80')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    overlay: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
    },

    heroContent: {
      position: "relative",
      textAlign: "center",
      color: "white",
      zIndex: 2,
    },

    heroTitle: {
      fontSize: "3rem",
      marginBottom: "10px",
      fontWeight: 700,
    },

    heroSubtitle: {
      fontSize: "1.3rem",
      opacity: 0.9,
    },

    heroBtn: {
      marginTop: "20px",
      padding: "12px 25px",
      fontSize: "1rem",
      backgroundColor: "#ffca28",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
      textDecoration: "none",
      color: "black",
    },

    /* FEATURES */
    features: {
      padding: "60px 40px",
      textAlign: "center",
    },

    featuresTitle: {
      fontSize: "2rem",
      marginBottom: "30px",
      fontWeight: 600,
    },

    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
    },

    featureCard: {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
    },

    featureIcon: {
      fontSize: "2.5rem",
      marginBottom: "10px",
      color: "#0056a6",
    },

    featureCardTitle: {
      fontSize: "1.4rem",
      marginBottom: "10px",
      fontWeight: 600,
    },

    /* CTA SECTION */
    cta: {
      background: "#003b6f",
      color: "white",
      padding: "60px 40px",
      textAlign: "center",
      marginTop: "40px",
    },

    ctaBtn: {
      marginTop: "20px",
      padding: "12px 30px",
      border: "none",
      backgroundColor: "#ffca28",
      color: "black",
      fontSize: "1.1rem",
      cursor: "pointer",
      borderRadius: "5px",
      textDecoration: "none",
    },

    /* INDUSTRY FOOTER */
    footer: {
      backgroundColor: "#0d1b2a",
      color: "#e0e6ed",
      padding: "40px 20px",
      marginTop: "50px",
    },

    footerContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
      maxWidth: "1100px",
      margin: "0 auto",
    },

    footerColumnTitle: {
      fontSize: "1.2rem",
      marginBottom: "12px",
      fontWeight: "bold",
    },

    footerLink: {
      textDecoration: "none",
      color: "#d6dce3",
      fontSize: "0.95rem",
      display: "block",
      marginBottom: "6px",
      cursor: "pointer",
    },

    socialRow: {
      display: "flex",
      gap: "12px",
      marginTop: "10px",
    },

    socialIcon: {
      fontSize: "1.3rem",
      color: "#ffca28",
      cursor: "pointer",
    },

    footerBottom: {
      textAlign: "center",
      marginTop: "30px",
      borderTop: "1px solid #2d3e50",
      paddingTop: "15px",
      fontSize: "0.9rem",
      opacity: 0.8,
    },
  };

  return (
    <div style={styles.homeContainer}>
      {/* HERO */}
      <header style={styles.hero}>
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Monitoring & Evaluation System</h1>
          <p style={styles.heroSubtitle}>Namibian National Planning Commission</p>
          
          {/* LINK MAINTAINED */}
          <Link to="/login" style={styles.heroBtn}>
            Get Started
          </Link>
        </div>
      </header>

      {/* FEATURES */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Core Functional Areas</h2>

        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <FiActivity style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Project Tracking</h3>
            <p>Monitor national projects, milestones, timelines and KPIs in real-time.</p>
          </div>

          <div style={styles.featureCard}>
            <FiFileText style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Data Reporting</h3>
            <p>Generate high-level summaries and detailed analytical reports.</p>
          </div>

          <div style={styles.featureCard}>
            <FiBarChart2 style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Performance Insights</h3>
            <p>Access dashboards with advanced charts and insights.</p>
          </div>

          <div style={styles.featureCard}>
            <FiUsers style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Stakeholder Management</h3>
            <p>Track institutions, responsible officers, roles and access levels.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta}>
        <h2>Enhancing Accountability & Transparency</h2>
        <p>Empowering Namibia through efficient monitoring of national development projects.</p>
        
        {/* LINK MAINTAINED */}
        <Link to="/login" style={styles.ctaBtn}>
          Login to Dashboard
        </Link>
      </section>

      {/* INDUSTRY FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div>
            <h3 style={styles.footerColumnTitle}>About NPC</h3>
            <a style={styles.footerLink}>Mandate</a>
            <a style={styles.footerLink}>Vision & Mission</a>
            <a style={styles.footerLink}>Policies</a>
          </div>

          <div>
            <h3 style={styles.footerColumnTitle}>Useful Links</h3>
            <a style={styles.footerLink}>National Development Plans</a>
            <a style={styles.footerLink}>Public Documents</a>
            <a style={styles.footerLink}>Support</a>
          </div>

          <div>
            <h3 style={styles.footerColumnTitle}>Connect With Us</h3>
            <div style={styles.socialRow}>
              <FaFacebookF style={styles.socialIcon} />
              <FaTwitter style={styles.socialIcon} />
              <FaLinkedinIn style={styles.socialIcon} />
              <FaYoutube style={styles.socialIcon} />
            </div>
          </div>
        </div>

        <div style={styles.footerBottom}>
          © {new Date().getFullYear()} National Planning Commission — Monitoring & Evaluation System
        </div>
      </footer>
    </div>
  );
}
