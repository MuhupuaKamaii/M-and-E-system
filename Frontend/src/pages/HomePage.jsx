import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteMovingCards from '../components/ui/InfiniteMovingCards';
import '../Styles/Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  // Recent Updates Data
  const recentUpdates = [
    {
      category: 'Development Plan',
      date: 'November 15, 2025',
      title: 'National Development Plan (NDP6) Mid-Term Review Shows Strong Progress',
      description: 'The mid-term evaluation reveals significant achievements in infrastructure development, education reform, and economic diversification initiatives across key sectors.',
      status: 'In Progress'
    },
    {
      category: 'Technology',
      date: 'November 12, 2025',
      title: 'Digital Government Services Platform Launched',
      description: 'New online platform streamlines citizen services and government interactions, reducing processing times by 60%.',
      status: 'Active'
    },
    {
      category: 'Infrastructure',
      date: 'November 10, 2025',
      title: 'Rural Healthcare Facilities Expansion Complete',
      description: 'Twelve new healthcare centers now operational in remote communities, improving access for over 50,000 residents.',
      status: 'Completed'
    },
    {
      category: 'Education',
      date: 'November 8, 2025',
      title: 'STEM Education Initiative Reaches 200 Schools',
      description: 'Science, technology, engineering, and mathematics programs expanded to enhance technical skills development nationwide.',
      status: 'Active'
    }
  ];

  // Upcoming Initiatives Data
  const upcomingInitiatives = [
    {
      category: 'Energy',
      date: 'Starting December 2025',
      title: 'Renewable Energy Infrastructure Program',
      description: 'Major solar and wind projects to increase national renewable energy capacity by 40% over the next three years.',
      status: 'Planning Phase'
    },
    {
      category: 'Employment',
      date: 'Starting January 2026',
      title: 'Youth Skills Development Program Launch',
      description: 'Comprehensive training initiative designed to equip 10,000 young Namibians with market-relevant skills.',
      status: 'Preparation'
    },
    {
      category: 'Urban Development',
      date: 'Q2 2026',
      title: 'Smart Cities Pilot Project Initiation',
      description: 'Technology-driven urban development initiatives planned for Windhoek, Walvis Bay, and Oshakati.',
      status: 'Coming Soon'
    },
    {
      category: 'Infrastructure',
      date: 'Q3 2026',
      title: 'National Transport Corridor Enhancement',
      description: 'Major upgrade of transport infrastructure connecting key economic zones and neighboring countries.',
      status: 'Planning Phase'
    }
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections with fade-in-up class
    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach((el) => observer.observe(el));

    // Scroll progress indicator
    const updateScrollProgress = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      const progressBar = document.querySelector('.scroll-progress-bar');
      if (progressBar) {
        progressBar.style.width = scrolled + '%';
      }
    };

    // Section navigation dots
    const updateNavDots = () => {
      const sections = ['landing-section', 'brief-intro', 'news-highlights'];
      const dots = document.querySelectorAll('.nav-dot');
      
      sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId) || document.querySelector(`.${sectionId}`);
        if (section) {
          const rect = section.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2;
          
          if (dots[index]) {
            dots[index].classList.toggle('active', isVisible);
          }
        }
      });
    };

    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('scroll', updateNavDots);
    
    // Initial calls
    updateScrollProgress();
    updateNavDots();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateScrollProgress);
      window.removeEventListener('scroll', updateNavDots);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Scroll Progress Indicator */}
      <div className="scroll-progress">
        <div className="scroll-progress-bar"></div>
      </div>

      {/* Section Navigation Dots */}
      <div className="section-nav">
        <div 
          className="nav-dot" 
          data-tooltip="Home"
          onClick={() => scrollToSection('landing-section')}
        ></div>
        <div 
          className="nav-dot" 
          data-tooltip="About"
          onClick={() => scrollToSection('brief-intro')}
        ></div>
        <div 
          className="nav-dot" 
          data-tooltip="News"
          onClick={() => scrollToSection('news-highlights')}
        ></div>
      </div>

      {/* Landing Section */}
      <section id="landing-section" className="landing-section hero-with-image">
        {/* Gray Overlay */}
        <div className="hero-overlay"></div>
        
        <header className="home-header">
          <div className="header-container">
            <div className="logo-section">
              <div className="npc-logo">
                <span className="logo-text">NPC</span>
              </div>
              <h1>National Planning Commission</h1>
            </div>
            <nav className="home-nav">
              <a href="/login" className="nav-cta">Login</a>
            </nav>
          </div>
        </header>
        
        <div className="hero-content">
          <h2>Building Namibia's Future Through Strategic Planning</h2>
          <p className="hero-subtitle">
            Coordinating national development planning and monitoring implementation 
            of government policies and programs for sustainable growth.
          </p>
          <button className="get-started-btn" onClick={handleGetStarted}>
            Get Started
          </button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={() => scrollToSection('brief-intro')}>
          <span className="scroll-text">Scroll to learn more</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </section>

      {/* Brief Intro Section */}
      <section id="brief-intro" className="brief-intro-section">
        <div className="container">
          <div className="intro-header fade-in-up">
            <h2>About the National Planning Commission</h2>
            <p className="intro-subtitle">
              Leading Namibia's development through strategic planning and effective coordination
            </p>
          </div>
          
          <div className="intro-content fade-in-up">
            <div className="mission-vision">
              <div className="mission">
                <h3>Our Mission</h3>
                <p>
                  To coordinate national development planning and facilitate the implementation 
                  of government policies and programs that promote sustainable economic growth 
                  and improved quality of life for all Namibians.
                </p>
              </div>
              <div className="vision">
                <h3>Our Vision</h3>
                <p>
                  A prosperous and industrialized Namibia, developed by her human resources, 
                  enjoying peace, harmony and political stability.
                </p>
              </div>
            </div>
            
            <div className="key-functions">
              <h3>Key Functions</h3>
              <div className="functions-grid">
                <div className="function-item">
                  <div className="function-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4>Strategic Planning</h4>
                  <p>Develop comprehensive national development plans and policies</p>
                </div>
                <div className="function-item">
                  <div className="function-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 19V9a2 2 0 00-2-2h-2a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4>Monitoring & Evaluation</h4>
                  <p>Track progress and assess implementation of development programs</p>
                </div>
                <div className="function-item">
                  <div className="function-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4>Coordination</h4>
                  <p>Facilitate collaboration between government ministries and agencies</p>
                </div>
                <div className="function-item">
                  <div className="function-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h4>Policy Analysis</h4>
                  <p>Provide research and analysis to inform policy decisions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Highlights Section */}
      <section id="news-highlights" className="news-highlights-section">
        <div className="container">
          <div className="news-header fade-in-up">
            <h2>Latest News & Project Updates</h2>
            <p>Stay informed about current and upcoming development initiatives</p>
          </div>
          
          {/* Recent Updates Moving Cards */}
          <div className="fade-in-up">
            <h3 className="moving-section-title">Recent Updates</h3>
            <InfiniteMovingCards
              items={recentUpdates}
              direction="left"
              speed="slow"
            />
          </div>
          
          {/* Upcoming Initiatives Moving Cards */}
          <div className="fade-in-up">
            <h3 className="moving-section-title">Upcoming Initiatives</h3>
            <InfiniteMovingCards
              items={upcomingInitiatives}
              direction="right"
              speed="slow"
            />
          </div>
          
          <div className="view-all-news">
            <button className="view-all-btn">View All Updates</button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="home-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="npc-logo-footer">
                  <span className="logo-text">NPC</span>
                </div>
                <h3>National Planning Commission</h3>
              </div>
              <p className="footer-tagline">
                Building Namibia's future through strategic planning and sustainable development initiatives.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="footer-links-grid">
              <div className="footer-column">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/national-plans">National Plans</a></li>
                  <li><a href="/publications">Publications</a></li>
                  <li><a href="/research">Research & Reports</a></li>
                  <li><a href="/opportunities">Opportunities</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="/policies">Policies & Guidelines</a></li>
                  <li><a href="/data">Data & Statistics</a></li>
                  <li><a href="/downloads">Downloads</a></li>
                  <li><a href="/faq">FAQ</a></li>
                  <li><a href="/feedback">Feedback</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Government</h4>
                <ul>
                  <li><a href="https://www.gov.na">Government Portal</a></li>
                  <li><a href="/ministries">Ministries & Agencies</a></li>
                  <li><a href="/transparency">Transparency</a></li>
                  <li><a href="/procurement">Procurement</a></li>
                  <li><a href="/careers">Careers</a></li>
                </ul>
              </div>
              
              <div className="footer-column">
                <h4>Contact Us</h4>
                <ul className="contact-info">
                  <li>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    <span>Government Office Park<br />Windhoek, Namibia</span>
                  </li>
                  <li>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span>+264 61 283 4111</span>
                  </li>
                  <li>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span>info@npc.gov.na</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-divider"></div>
          
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="copyright">&copy; 2025 National Planning Commission, Republic of Namibia. All rights reserved.</p>
              <div className="footer-legal">
                <a href="/privacy">Privacy Policy</a>
                <span className="separator">•</span>
                <a href="/terms">Terms of Service</a>
                <span className="separator">•</span>
                <a href="/accessibility">Accessibility</a>
                <span className="separator">•</span>
                <a href="/sitemap">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
