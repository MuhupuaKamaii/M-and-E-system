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
          <div className="footer-content">
            <div className="footer-section">
              <h4>National Planning Commission</h4>
              <p>Government Office Park<br />
              Private Bag 13356<br />
              Windhoek, Namibia</p>
            </div>
            
            <div className="footer-section">
              <h4>Contact Information</h4>
              <p>Tel: +264 61 283 4111<br />
              Email: info@npc.gov.na<br />
              Website: www.npc.gov.na</p>
            </div>
            
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/national-plans">National Plans</a></li>
                <li><a href="/publications">Publications</a></li>
                <li><a href="/opportunities">Opportunities</a></li>
                <li><a href="/feedback">Feedback</a></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h4>Government Links</h4>
              <ul>
                <li><a href="https://www.gov.na">Government Portal</a></li>
                <li><a href="/ministries">Ministries & Agencies</a></li>
                <li><a href="/policies">Public Policies</a></li>
                <li><a href="/transparency">Transparency</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="copyright">
              <p>&copy; 2025 National Planning Commission, Republic of Namibia. All rights reserved.</p>
            </div>
            <div className="footer-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
              <a href="/accessibility">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;