import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaChevronDown } from "react-icons/fa";
import { FiActivity, FiFileText, FiBarChart2, FiUsers } from "react-icons/fi";

export default function HomePage() {
  const [openDropdown, setOpenDropdown] = useState(false);

  const styles = {
    homeContainer: {
      fontFamily: "Segoe UI, Arial, sans-serif",
      color: "#1a1a1a",
      backgroundColor: "#f7f9fb",
    },

    /* NAVBAR */
    nav: {
      display: "flex",
      justifyContent: "space-between",
      padding: "18px 50px",
      backgroundColor: "#ffffff",
      alignItems: "center",
      borderBottom: "1px solid #e2e8f0",
      position: "sticky",
      top: 0,
      zIndex: 30,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    logo: {
      fontSize: 23,
      fontWeight: 700,
      color: "#003366",
      letterSpacing: ".5px",
    },
    navRight: { display: "flex", alignItems: "center", gap: 28 },
    navLink: {
      textDecoration: "none",
      fontSize: 16,
      color: "#003366",
      fontWeight: 500,
      transition: "0.25s",
    },

    loginBtn: {
      padding: "10px 24px",
      fontSize: 15,
      backgroundColor: "#003366",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      transition: "0.25s",
    },

    /* DROPDOWN MENU */
    dropdown: { position: "relative" },
    dropdownBtn: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: "transparent",
      border: "1px solid #003366",
      padding: "8px 12px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 14,
      color: "#003366",
      fontWeight: 500,
      transition: "0.25s",
    },
    dropdownMenu: {
      position: "absolute",
      top: "45px",
      right: 0,
      backgroundColor: "#ffffff",
      borderRadius: 8,
      minWidth: 180,
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      padding: "10px 0",
      zIndex: 40,
      animation: "fadeIn 0.25s ease-in-out",
    },
    dropdownItem: {
      padding: "10px 16px",
      display: "block",
      cursor: "pointer",
      textDecoration: "none",
      color: "#003366",
      fontSize: 14,
      fontWeight: 500,
      transition: "0.25s",
    },

    /* HERO */
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
      background: "rgba(0,0,0,0.5)",
    },
    heroContent: {
      position: "relative",
      textAlign: "center",
      color: "white",
      zIndex: 2,
    },
    heroTitle: {
      fontSize: "3.4rem",
      marginBottom: "12px",
      fontWeight: 800,
      letterSpacing: "1px",
    },
    heroSubtitle: {
      fontSize: "1.45rem",
      opacity: 0.9,
      marginBottom: "15px",
    },
    heroBtn: {
      marginTop: "20px",
      padding: "12px 28px",
      fontSize: "1rem",
      backgroundColor: "#ffca28",
      border: "none",
      cursor: "pointer",
      borderRadius: "6px",
      textDecoration: "none",
      color: "black",
      fontWeight: 600,
      transition: "0.25s",
    },

    /* FEATURES */
    features: {
      padding: "75px 40px",
      textAlign: "center",
    },
    featuresTitle: {
      fontSize: "2.3rem",
      marginBottom: "35px",
      fontWeight: 700,
      color: "#003366",
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
      gap: "30px",
    },
    featureCard: {
      background: "white",
      padding: "28px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      textAlign: "center",
      transition: "0.3s",
    },
    featureIcon: {
      fontSize: "2.8rem",
      marginBottom: "10px",
      color: "#0056a6",
    },
    featureCardTitle: {
      fontSize: "1.45rem",
      marginBottom: "10px",
      fontWeight: 600,
    },

    /* ABOUT SECTION */
    aboutSection: {
      padding: "75px 40px",
      backgroundColor: "white",
      textAlign: "center",
    },
    aboutTitle: {
      fontSize: "2.2rem",
      fontWeight: 700,
      marginBottom: "20px",
      color: "#003366",
    },
    aboutDesc: {
      maxWidth: "900px",
      margin: "0 auto",
      fontSize: "1.1rem",
      lineHeight: "1.65",
      color: "#333",
    },

    /* FOOTER */
    footer: {
      backgroundColor: "#0d1b2a",
      color: "#e0e6ed",
      padding: "50px 20px",
      marginTop: "50px",
    },
    footerContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "30px",
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
      gap: "15px",
      marginTop: "10px",
    },
    socialIcon: {
      fontSize: "1.4rem",
      color: "#ffca28",
      cursor: "pointer",
    },
    footerBottom: {
      textAlign: "center",
      marginTop: "35px",
      borderTop: "1px solid #2d3e50",
      paddingTop: "15px",
      fontSize: "0.9rem",
      opacity: 0.8,
    },
  };

  return (
    <div style={styles.homeContainer}>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo}>Monitoring & Evaluation System</div>

        <div style={styles.navRight}>
          <a href="https://www.npc.gov.na/" style={styles.navLink}>NPC Website</a>

          {/* DROPDOWN */}
          <div
            style={styles.dropdown}
            onMouseEnter={() => setOpenDropdown(true)}
            onMouseLeave={() => setOpenDropdown(false)}
          >
            <button style={styles.dropdownBtn}>
              Frameworks <FaChevronDown />
            </button>

            {openDropdown && (
              <div style={styles.dropdownMenu}>
                <a style={styles.dropdownItem} href="https://react.dev/">Vision 2030</a>
                <a style={styles.dropdownItem} href="https://vuejs.org/">NDP 6</a>
              </div>
            )}
          </div>

          <Link to="/login">
            <button style={styles.loginBtn}>Login</button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header style={styles.hero}>
        <div style={styles.overlay}></div>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Monitoring & Evaluation System</h1>
          <p style={styles.heroSubtitle}>Namibian National Planning Commission</p>

          <Link to="/login" style={styles.heroBtn}>Get Started</Link>
        </div>
      </header>

      {/* FEATURES */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Core Functional Areas</h2>

        <div style={styles.featureGrid}>
          <div
            style={styles.featureCard}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <FiActivity style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Project Tracking</h3>
            <p>Monitor national projects, milestones and KPIs in real time.</p>
          </div>

          <div
            style={styles.featureCard}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <FiFileText style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Data Reporting</h3>
            <p>Generate summaries and detailed analytical reports.</p>
          </div>

          <div
            style={styles.featureCard}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <FiBarChart2 style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Performance Insights</h3>
            <p>Access dashboards with advanced charts and insights.</p>
          </div>

          <div
            style={styles.featureCard}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <FiUsers style={styles.featureIcon} />
            <h3 style={styles.featureCardTitle}>Stakeholder Management</h3>
            <p>Track institutions, roles and responsible officers.</p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section style={styles.aboutSection}>
        <h2 style={styles.aboutTitle}>About The System</h2>
        <p style={styles.aboutDesc}>
          The Monitoring & Evaluation System of the National Planning Commission is
          designed to enhance transparency, accountability, and efficiency in the
          execution of national development initiatives.
          <br /><br />
          With real-time performance tracking, advanced analytics, and stakeholder
          collaboration tools, the system empowers policymakers and institutions to
          make evidence-based decisions that drive sustainable national progress.
        </p>
      </section>

      {/* FOOTER */}
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
